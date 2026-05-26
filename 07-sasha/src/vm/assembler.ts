import type { Potential } from "../shared/potential";
import { Err, type Result } from "../shared/result";
import { Allocator } from "./allocator";
import type { SegmentAllocator } from "./segment";
export type AssemblerError = {
  message: string;
};

export type AssemblerPayload = Record<
  string,
  { start: number; type: AssemblerBlock["type"] }
>;

export type AssemblerBlock = {
  start: number;
  type: "readonly" | "write" | "prog";
};

/**
 * The assembler acts as the middleman between the allocators, symbols, offsets, and memory.
 */
export class Assembler {
  #dataSegments = new Map<string, AssemblerBlock>();
  #symbols = new Map<string, number>();
  #allocator;
  #memory;

  constructor(existingMemoryBuffer: Uint8Array) {
    this.#memory = existingMemoryBuffer;
    this.#allocator = new Allocator(this.#memory);
  }

  generateSegmentsFrom(segAlloc: SegmentAllocator): void {
    const segments = segAlloc.getSegments();

    for (const [name, segment] of segments) {
      this.#dataSegments.set(name, {
        start: segment.start,
        type: "write",
      });
    }
  }

  allocateSegment(
    segmentName: string,
    size: number,
    type: AssemblerBlock["type"],
  ): Potential<AssemblerError> {
    if (this.#dataSegments.has(segmentName)) {
      return Err<AssemblerError>({
        message: `Segment with name ${segmentName} already exists.`,
      });
    }

    const allocationResult = this.#allocator.alloc(size, segmentName);

    if (!allocationResult.ok) {
      return Err<AssemblerError>({
        message: `Failed to allocate segment ${segmentName}: ${allocationResult.value.message}`,
      });
    }

    this.#dataSegments.set(segmentName, {
      start: allocationResult.value.start,
      type,
    });
  }

  generateSegmentsFromPayload(payload: AssemblerPayload): void {
    for (const [name, segment] of Object.entries(payload)) {
      this.#dataSegments.set(name, {
        start: segment.start,
        type: segment.type ?? "write",
      });
    }
  }

  getType(segmentName: string): Result<AssemblerBlock["type"], AssemblerError> {
    const segmentType = this.#dataSegments.get(segmentName)?.type;
    if (!segmentType) {
      return {
        ok: false,
        value: {
          message: `getType called with invalid segment name: ${segmentName}`,
        },
      };
    }

    return {
      ok: true,
      value: segmentType ?? "none",
    };
  }

  /**
   * NOTE: redefinition is allowed. will override previous address.
   * TODO: if causes memory issue, use redefineSymbol.
   * @param symbolName
   * @param address
   */
  defineSymbol(symbolName: string, address: number): void {
    this.#symbols.set(symbolName, address);
  }

  /**
   * This function will reserve a protected buffer.
   *
   * The algorithm works through searching for an available spot that fills in the space defined in SPACE, or by default 1
   * @param symbolName
   */
  reserveProtectedBuffer(
    symbolName: string,
    size: number,
  ): Result<Uint8Array, AssemblerError> {
    let protBuf = this.#allocator.alloc(size, symbolName);

    if (!protBuf.ok) {
      return {
        ok: false,
        value: {
          message: `Failed to reserve protected buffer for symbol ${symbolName}: ${protBuf.value.message}`,
        },
      };
    }

    return {
      ok: true,
      value: protBuf.value.window,
    };
  }

  writeToSegment(
    segmentName: string,
    offset: number,
    data: ArrayLike<number>,
  ): Result<number, AssemblerError> {
    if (!this.#dataSegments.has(segmentName)) {
      return {
        ok: false,
        value: {
          message: `writeTo called with invalid segment name: ${segmentName}`,
        },
      };
    }

    if (this.#dataSegments.get(segmentName)!.type === "readonly") {
      return {
        ok: false,
        value: {
          message: `writeTo called on a readonly segment: ${segmentName}`,
        },
      };
    }

    // set segs.data[segs[name]] to given data.
    this.#memory.set(data, this.#dataSegments.get(segmentName)!.start + offset);

    return {
      ok: true,
      value: this.#dataSegments.get(segmentName)!.start + offset,
    };
  }

  getAllocator(): Allocator {
    return this.#allocator;
  }
}
