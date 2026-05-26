import { describe, beforeAll, afterAll, test, expect } from "bun:test";
import { Loader } from "./loader";
describe("VM Behavior", () => {
  test("Loader can create and add bytes", () => {
    let l = new Loader();
    l.loadBytes([2, 3, 4, 5]);

    expect(l.getCurrentAddress()).toBe(0);
    expect(l.getCurrentByte()).toBe(2);
    expect(l.canAdvance()).toBe(true);
  });

  test("Loader can advnace", () => {
    let l = new Loader();
    l.loadBytes([2, 3, 4, 5]);

    // read 2 bytes at a time, checking each payload
    // should equal, and should have no bytes left to read
    expect(l.canAdvance()).toBe(true);
    expect(l.readNext(2)).toEqual(new Uint8Array([2, 3]));
    expect(l.getCurrentAddress()).toBe(2);
    expect(l.readNext(2)).toEqual(new Uint8Array([4, 5]));
    expect(l.getCurrentAddress()).toBe(4);
    expect(l.readNext(2)).toEqual(new Uint8Array([0, 0]));
  });

  test("Loader Goto address", () => {
    let l = new Loader();
    l.loadBytes([2, 3, 4, 5, 6, 21, 33, 31, 31, 4, 24, 42, 13]);

    expect(l.getCurrentAddress()).toBe(0);
    expect(l.readNext(5)).toEqual(new Uint8Array([2, 3, 4, 5, 6]));
    expect(l.getCurrentAddress()).toBe(5);
    expect(l.readNext(3)).toEqual(new Uint8Array([21, 33, 31]));

    expect(l.goToAddress(2)).pass();
    expect(l.getCurrentAddress()).toBe(2);
    expect(l.getCurrentByte()).toBe(4);
  });

  test("Loader Push pop", () => {
    let l = new Loader();
    l.loadBytes([1]);

    expect(l.stackPush(5)).pass();
    expect(l.stackPop()).toBe(5);
    expect(l.stackPop()).toBe(0);

    expect(l.stackPush(10)).pass();
    expect(l.stackPush(15)).pass();
    expect(l.stackPush(25)).pass();

    expect(l.stackPop()).toBe(25);
    expect(l.stackPop()).toBe(15);
    expect(l.stackPop()).toBe(10);
  });

  test("Loader Intense Situations", () => {
    let l = new Loader();
    l.loadBytes([1]);

    expect(l.canAdvance()).toBe(true);
    expect(l.readNext(1351313)).toBeFalsy(); // should be null
  });

  test("Loader Error", () => {
    let l = new Loader();
    l.loadBytes([1]);
    expect(l.goToAddress(1338915389)).toEqual({
      ok: false,
      value: {
        message:
          "Address to jump to (1338915389) is larger than max bytecode size. (65536)",
      },
    });
  });
});
