import { describe, expect, test } from "bun:test";
import { Assembler } from "./assembler";
import type { ProtectedBuffer } from "./allocator";

describe("Assembler functionality", () => {
  test("assembler can manage segments", () => {
    let buffer = new Uint8Array(1024);
    let asm = new Assembler(buffer);
    asm.generateSegmentsFromPayload({
      code: {
        start: 0x00,
        type: "prog",
      },
      data: {
        start: 0x100,
        type: "write",
      },
    });

    asm.writeToSegment("code", 0x00, [1, 2, 3, 4]);
    asm.writeToSegment("data", 0x00, [1, 2]);

    expect(buffer.slice(0, 4)).toEqual(new Uint8Array([1, 2, 3, 4]));
    expect(buffer.slice(0x100, 0x102)).toEqual(new Uint8Array([1, 2]));
  });

  test("assembler can error readonly", () => {
    let buffer = new Uint8Array(1024);
    let asm = new Assembler(buffer);
    asm.generateSegmentsFromPayload({
      code: {
        start: 0x00,
        type: "prog",
      },
      data: {
        start: 0x100,
        type: "readonly",
      },
    });
    expect(asm.writeToSegment("data", 0x00, [1, 2, 3]).ok).toBe(false); // NOT ok, you can NOT write to readonly block. has to be placed beforehand
  });

  test("assembler allocator matrix", () => {
    let buffer = new Uint8Array(1024);
    let asm = new Assembler(buffer);

    let code = asm.reserveProtectedBuffer("code", 329);
    let data = asm.reserveProtectedBuffer("data", 329);
    (data.value as Uint8Array).set([1, 2, 3]);

    let dataProtBuf = asm.getAllocator().findProtectedBuffer("data");
    expect(code.ok).toBe(true);
    expect((code.value as Uint8Array).length).toBe(329); // we verified codebuf is valid

    expect(dataProtBuf).toBeDefined();
    expect(dataProtBuf?.some.window.slice(0, 3)).toEqual(
      new Uint8Array([1, 2, 3]),
    );
    expect(asm.getAllocator().getAllocatedBlocks().size).toBe(2);
    asm.getAllocator().free("data");
    expect(asm.getAllocator().getAllocatedBlocks().size).toBe(1);
    expect(asm.getAllocator().getFreeBlocks().length).toBe(1);
    expect(asm.getAllocator().getFreeBlocks()).toEqual([
      {
        start: 329,
        length: 695,
      },
    ]);

    expect(asm.getAllocator().free("code")).pass();
    expect(asm.getAllocator().getFreeBlocks()).toEqual([
      {
        start: 0,
        length: 1024,
      },
    ]);
  });
});
