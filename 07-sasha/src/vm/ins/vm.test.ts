import { describe, expect, test } from "bun:test";
import { standardOpCodes } from "./opcodes";
import { VirtualMachine } from "./vm";
import { standardSaSHAInstructionSet } from "./impl/std";

describe("VM Run", () => {
  test("VM Run Add", () => {
    let mem = new Uint8Array(3000);
    let vm = new VirtualMachine({
      existingMemory: mem,
    });
    vm.allocateAreas();
    vm.setInstructionSet(standardSaSHAInstructionSet);

    vm.turnOn();
    vm.loadProgram([
      standardOpCodes.PUSH,
      5,
      standardOpCodes.PUSH,
      10,
      standardOpCodes.ADD,
      standardOpCodes.HALT,
    ]);

    vm.step(4);

    expect(vm.pop()).toBe(15);
    expect(vm.isOff()).toBe(true);
  });

  test("VM Function", () => {
    let mem = new Uint8Array(3000);
    let vm = new VirtualMachine({
      existingMemory: mem,
    });
    vm.allocateAreas();
    vm.turnOn();
    vm.setInstructionSet(standardSaSHAInstructionSet);

    // prettier-ignore
    vm.loadProgram([
      standardOpCodes.PUSH, 5,
      standardOpCodes.PUSH, 10,
      standardOpCodes.CALL, 7,

      standardOpCodes.HALT,

      standardOpCodes.ADD, standardOpCodes.RET,
    ]);

    vm.step(9);

    expect(vm.pop()).toBe(15);
    expect(vm.isOff()).toBe(true);
  });

  test("VM More function", () => {
    let mem = new Uint8Array(3000);
    let vm = new VirtualMachine({
      existingMemory: mem,
    });
    vm.allocateAreas();
    vm.turnOn();
    vm.setInstructionSet(standardSaSHAInstructionSet);

    // prettier-ignore
    vm.loadProgram([
      standardOpCodes.PUSH, 5,
      standardOpCodes.PUSH, 10,
      standardOpCodes.CALL, 7,

      standardOpCodes.HALT,

      standardOpCodes.ADD, standardOpCodes.PUSH, 5, standardOpCodes.ADD, standardOpCodes.RET,
    ]);

    vm.step(9);

    expect(vm.pop()).toBe(20);
    expect(vm.isOff()).toBe(true);
  });

  test("VM JMP Skip", () => {
    let mem = new Uint8Array(3000);
    let vm = new VirtualMachine({
      existingMemory: mem,
    });

    vm.allocateAreas();
    vm.turnOn();
    vm.setInstructionSet(standardSaSHAInstructionSet);

    // prettier-ignore
    vm.loadProgram([
      standardOpCodes.PUSH, 5,
      standardOpCodes.PUSH, 10,
      standardOpCodes.JMP, 7,
      standardOpCodes.ADD,
      standardOpCodes.HALT,
    ]);

    vm.run();

    expect(vm.pop()).toBe(10);
    expect(vm.isOff()).toBe(true);
  });

  test("VM Something Random", () => {
    let mem = new Uint8Array(3000);
    let vm = new VirtualMachine({
      existingMemory: mem,
    });

    vm.allocateAreas();
    vm.turnOn();
    vm.setInstructionSet(standardSaSHAInstructionSet);

    // prettier-ignore
    vm.loadProgram([
      standardOpCodes.PUSH, 5,
      standardOpCodes.PUSH, 10,
      standardOpCodes.JMP, 7,
      standardOpCodes.ADD,
      standardOpCodes.HALT,
    ]);

    vm.run();

    expect(vm.pop()).toBe(10);
    expect(vm.isOff()).toBe(true);
  });
});
