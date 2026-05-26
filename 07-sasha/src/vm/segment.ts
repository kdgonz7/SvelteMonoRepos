// saSHA sectors must not overlap.
// e.g. 0x0500 -> .data
// 						`strings, etc`
// but if prog 0
// check if prog intersects data, if so, throw errors.

import type { Potential } from "../shared/potential";
import { unwrap, type Result } from "../shared/result";
import type { Address } from "./types";

type SegmentAllocatorError = {
  message: string;
};

type Segment = {
  name: string;
  start: Address;
  length: number;
};

/**
 * Note: total length, if not defined, is inferred through length of all segments.
 */
type SegmentAllocatorOptions = {
  pageSize?: number;
};

/**
 * The segment allocator class ensures that no two segments overlap with each other.
 * * If you define data = `0x500`, then segAlloc.doOverlap('prog', 'data') => false if no data in prog.
 * * If prog.length > data.start, then segAlloc.doOverlap('prog', 'data') should be true.
 */
export class SegmentAllocator {
  #segments = new Map<string, Segment>();

  // TODO: see if this has ANY purpose
  constructor() {}

  /**
   * Registers a segment at `start` address.
   * @param name The name of the segment to register.
   * @param start The start of this segment.
   * @returns potential error if segment exists.
   */
  registerSegment(
    name: string,
    start: number,
  ): Potential<SegmentAllocatorError> {
    if (this.#segments.has(name))
      return {
        ok: false,
        value: {
          message: "Segment with name already exists",
        },
      };

    this.#segments.set(name, {
      length: 0,
      name,
      start,
    });
  }

  /**
   * @param seg1 A string of a segment inside of the registered segments.
   * @param seg2 Another string of a segment in the registered segments
   * @returns A result of a potential error if one or both aren't valid segments, or a boolean value.
   */
  hasOverlap(
    seg1: string,
    seg2: string,
  ): Result<boolean, SegmentAllocatorError> {
    const firstSegment = this.#segments.get(seg1);
    const secondSegment = this.#segments.get(seg2);

    if (!firstSegment || !secondSegment)
      return {
        ok: false,
        value: {
          message: "one or both segments in hasOverlap are undefined.",
        },
      };

    if (firstSegment.name === secondSegment.name) {
      return {
        ok: false,
        value: {
          message: "Cannot check overlap of a segment with itself.",
        },
      };
    }

    return {
      ok: true,
      value:
        firstSegment.start < secondSegment.start + secondSegment.length &&
        secondSegment.start < firstSegment.start + firstSegment.length,
    };
  }

  /**
   * Increase a segment's size.
   * @param segmentName The segment to add bytes to.
   * @param bytes The bytes to add
   * @returns
   */
  safeApplyLength(
    segmentName: string,
    bytes: ArrayLike<number>,
  ): Potential<SegmentAllocatorError> {
    const segment = this.#segments.get(segmentName);
    if (!segment)
      return {
        ok: false,
        value: {
          message: "Segment does not exist.",
        },
      };

    for (const [name, _] of this.#segments) {
      if (name === segmentName) continue;
      let isOverlap = this.hasOverlap(segmentName, name!);

      if (unwrap(isOverlap) === true)
        return {
          ok: false,
          value: {
            message: `Segment overlaps with existing '${name}'`,
          },
        };
    }

    this.unsafeApplyLength(segmentName, bytes);
  }

  unsafeApplyLength(segmentName: string, bytes: ArrayLike<number>): void {
    const segment = this.#segments.get(segmentName);
    if (!segment) return;
    segment.length += bytes.length;
  }

  removeSegment(segmentName: string): Potential<SegmentAllocatorError> {
    if (!this.#segments.has(segmentName)) {
      return {
        ok: false,
        value: {
          message: "Segment does not exist.",
        },
      };
    }
    this.#segments.delete(segmentName);
  }

  /**
   * Helper function to reduce all segments to a quantitative value. E.g. `(c) => c.length`
   * @param attribute
   * @param d
   * @returns
   */
  reduceAllTo(attribute: (c: Segment) => number, d: number) {
    return Array.from(this.#segments.values()).reduce(
      (accumulator, cv) => accumulator + attribute(cv),
      d,
    );
  }

  highestWatermark(): number {
    let maxEnd = 0;
    for (const [_, seg] of this.#segments) {
      if (seg.start + seg.length > maxEnd) {
        maxEnd = seg.start + seg.length;
      }
    }
    return maxEnd;
  }
  /**
   * A function used to check if the total size of all segments exceeds a certain size. This is useful for checking if the total size of all segments exceeds the maximum bytecode size.
   * @param size The size to check against.
   * @returns true if the sizes of all of the segments yield a value higher than `size`
   */
  usageSatisfies(predicate: (highest: number) => boolean): boolean {
    return predicate(this.reduceAllTo((c) => c.length, 0));
  }

  highestAddressSatisfies(predicate: (highest: number) => boolean): boolean {
    return predicate(this.highestWatermark());
  }

  getSegments(): Map<string, Segment> {
    return this.#segments;
  }
}
