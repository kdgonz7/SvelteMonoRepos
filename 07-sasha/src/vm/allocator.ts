import type { Optional, Potential } from "../shared/potential";
import type { Result } from "../shared/result";

/**
 * A free block is an open bit of memory. When a protectedbuffer is necessary, you take a chunk out of a free block and put it
 * to a ReservedBlock
 */
export type FreeBlock = {
  start: number;
  length: number;
};
export type ReservedBlock = {
  start: number;
  length: number;
  symbol: string;
};
export type ProtectedBuffer = {
  start: number;
  window: Uint8Array;
};

/**
 * The allocator class manages memory. Allows memory to be allocated, and freed, and provides
 * windows into an existing memory buffer.
 */
export class Allocator {
  #freeList = new Array<FreeBlock>();
  #reserveList = new Map<string, ReservedBlock>();
  #memory;

  constructor(memoryBuffer: Uint8Array) {
    this.#memory = memoryBuffer;
    this.#freeList.push({
      start: 0,
      length: this.#memory.length,
    });
  }

  /**
   * Allocate a block at `symbol` with given memory. Will take parts of an existing block, or utilize a whole block if necessary.
   * @param length
   * @param symbol
   * @returns
   */
  alloc(
    length: number,
    symbol: string,
  ): Result<ProtectedBuffer, { message: string }> {
    for (const node of this.#freeList) {
      if (node.length >= length) {
        const reservedBlock = {
          start: node.start,
          length,
          symbol,
        };

        node.start += length;
        node.length -= length;
        if (node.length === 0) {
          this.#freeList = this.#freeList.filter((n) => n !== node);
        }

        this.#reserveList.set(symbol, reservedBlock);

        return {
          ok: true,
          value: {
            start: reservedBlock.start,
            window: this.#memory.subarray(
              reservedBlock.start,
              reservedBlock.start + reservedBlock.length,
            ),
          },
        };
      }
    }

    return {
      ok: false,
      value: {
        message: "No free block of sufficient size found",
      },
    };
  }

  /**
   * Free memory used by a block with symbol <symbol>
   * @param symbol
   * @returns
   */
  free(symbol: string): Potential<{ message: string }> {
    let node = this.#reserveList.get(symbol);
    if (!node) {
      return {
        ok: false,
        value: {
          message: "No reserved block with the given symbol found",
        },
      };
    }

    this.#freeList.push({
      start: node.start,
      length: node.length,
    });
    this.#reserveList.delete(symbol);
    this.#freeList.sort((a, b) => a.start - b.start);

    for (let i = 0; i < this.#freeList.length - 1; i++) {
      let current = this.#freeList[i]!;
      let next = this.#freeList[i + 1]!;

      if (current.start + current.length === next.start) {
        current.length += next.length;
        this.#freeList.splice(i + 1, 1);
        i--; // recheck for another
      }
    }
  }

  findBlock(symbolName: string): Optional<ReservedBlock> {
    const node = this.#reserveList.get(symbolName);

    if (node) return { some: node };
    return null;
  }

  findProtectedBuffer(symbolName: string): Optional<ProtectedBuffer> {
    const node = this.#reserveList.get(symbolName) ?? null;
    if (!node) return null;

    return {
      some: {
        start: node.start,
        window: this.#memory.subarray(node.start, node.start + node.length),
      },
    };
  }

  getAllocatedBlocks(): Map<string, ReservedBlock> {
    return this.#reserveList;
  }

  getFreeBlocks(): Array<FreeBlock> {
    return this.#freeList;
  }
}
