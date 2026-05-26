import { Some } from "../../../shared/potential";
import { Err } from "../../../shared/result";
import { standardOpCodes } from "../opcodes";
import type { InstructionSet, VirtualMachine } from "../vm";
import { VMError } from "../vm";

export const standardSaSHAInstructionSet: InstructionSet = {
  [standardOpCodes.PUSH]: (vm: VirtualMachine) => {
    const byteToPush = vm.reader.readOne();

    if (!byteToPush)
      return Err(VMError(vm.getState(), "failed to read push byte"));

    vm.reader.stackPush(byteToPush!);
  },

  [standardOpCodes.POP]: (vm: VirtualMachine) => {
    vm.pop();
  },

  [standardOpCodes.ADD]: (vm: VirtualMachine) => {
    const a = vm.reader.stackPop();
    const b = vm.reader.stackPop();

    if (a === undefined || b === undefined) {
      return Err(VMError(vm.getState(), "add requires two operands"));
    }

    vm.reader.stackPush(a + b);
  },
  [standardOpCodes.CALL]: (vm: VirtualMachine) => {
    const goto = vm.reader.readOne()!;
    vm.reader.readOne();
    vm.returnStack.push(vm.reader.getCurrentAddress());

    return Some(goto);
  },
  [standardOpCodes.RET]: (vm: VirtualMachine) => {
    const returnAddress = vm.returnStack.pop();
    return Some(returnAddress);
  },
  [standardOpCodes.HALT]: (vm: VirtualMachine) => {
    vm.turnOff();
  },
  [standardOpCodes.JMP]: (vm: VirtualMachine) => {
    const addr = vm.reader.readOne();
    if (addr) {
      return Some(addr);
    } else {
      return Err(VMError("ON", "error"));
    }
  },
};
