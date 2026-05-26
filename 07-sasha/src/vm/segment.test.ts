import { describe, test, expect } from "bun:test";
import { SegmentAllocator } from "./segment";

describe("VM unsafeApplyLength", () => {
  test("Segment Allocator can check overlap", () => {
    let l = new SegmentAllocator();
    l.registerSegment("code", 0x00);
    l.registerSegment("data", 0x010);

    l.unsafeApplyLength("code", [1, 2, 4, 5, 6, 67, 78]);
    expect(l.hasOverlap("code", "data")).toEqual({ ok: true, value: false });
    l.unsafeApplyLength("code", [1, 2, 4, 5, 6, 67, 78, 32, 32, 23]);
    expect(l.hasOverlap("code", "data")).toEqual({ ok: true, value: true });
  });

  test("Segment Allocator can remove segments", () => {
    let l = new SegmentAllocator();
    l.registerSegment("code", 0x00);
    l.registerSegment("data", 0x010);

    expect(l.removeSegment("code")).pass();
    expect(l.removeSegment("code")).toEqual({
      ok: false,
      value: { message: "Segment does not exist." },
    });
    expect(l.removeSegment("data")).pass();
    expect(l.removeSegment("data")).toEqual({
      ok: false,
      value: { message: "Segment does not exist." },
    });
  });

  test("VM safeApplyLength", () => {
    let l = new SegmentAllocator();
    l.registerSegment("code", 0x00);
    l.registerSegment("data", 0x100);

    expect(l.safeApplyLength("code", [1, 2, 4, 5, 6, 67, 78])).toEqual(
      undefined,
    );
    expect(l.hasOverlap("code", "code")).toEqual({
      ok: false,
      value: {
        message: "Cannot check overlap of a segment with itself.",
      },
    });
  });

  test("VM application", () => {
    let l = new SegmentAllocator();
    l.registerSegment("program", 0x00);
    l.registerSegment("data", 0x100);
    l.safeApplyLength("program", [28, 28, 28, 28, 28, 28, 28, 28, 28]);

    expect(l.hasOverlap("program", "data").value).toEqual(false);
  });

  test("VM overflowsWith", () => {
    let l = new SegmentAllocator();

    l.registerSegment("program", 0x00);
    l.registerSegment("data", 0x100);
    l.safeApplyLength("program", [28, 28, 28, 28]);
    l.safeApplyLength("data", [28, 28, 28, 28]);

    // overflows with 3,6 bc total size is 8
    expect(l.usageSatisfies((maxUsage: number) => maxUsage > 3)).toEqual(true);
    expect(l.usageSatisfies((maxUsage: number) => maxUsage > 6)).toEqual(true);
    expect(l.usageSatisfies((maxUsage: number) => maxUsage > 9)).toEqual(false);
    expect(l.highestAddressSatisfies((cap: number) => cap < 65536)).toEqual(
      true,
    );
  });
});
