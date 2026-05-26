import { Some, type Optional } from "../../shared/potential";
import { Err, isErr, Ok, type Result } from "../../shared/result";
import { Assembler } from "../assembler";
import { Loader as BytecodeLoader } from "../loader";
import { SegmentAllocator } from "../segment";
import { standardOpCodes, type OpCode } from "./opcodes";

export type VMState = "ON" | "OFF";
export type VMError = {
  currentState: VMState;
  message: string;
};
export let VMError = (currentState: VMState, message: string): VMError => {
  return {
    currentState,
    message,
  };
};
export type InstructionSet = Record<number, InstructionFn>;
export type InstructionFn = (v: VirtualMachine) => Optional<number>;
/**
 * The virtual machine brings together the assembler, allocator, loaders, and segmentation
 * to form a "computer" that can execute instructions
 */
export class VirtualMachine {
  #assemblerInternal;
  #instructions;
  reader;
  #segmentation;
  #memory;
  #state: VMState = "OFF";
  returnStack: Array<number> = new Array<number>();

  constructor({
    existingMemory,
    instructions,
  }: {
    existingMemory: Uint8Array;
    instructions?: InstructionSet;
  }) {
    this.#memory = existingMemory;
    this.#assemblerInternal = new Assembler(this.#memory);
    this.#instructions = new Map<number, InstructionFn>();
    this.reader = new BytecodeLoader(existingMemory);

    // note: purely for memory safety.
    this.#segmentation = new SegmentAllocator();
  }
  getState(): VMState {
    return this.#state;
  }
  allocateDefaultAreas() {
    //TODO: convert this into a payload -> object map of seg to seg info
    //      Might also need to change it to a VM function, so we don't repeat
    //      Allocations into the SegmentAllocator.
    let e = this.#assemblerInternal.allocateSegment("code", 1024, "prog");
    if (isErr(e)) {
      return Err("VM unable to allocate code bytes");
    }

    let f = this.#assemblerInternal.allocateSegment("data", 1024, "write");
    if (isErr(f)) {
      return Err("VM unable to allocate data bytes");
    }
  }

  /**
   * Loads a program into the `code` memory.
   * @param bytes
   * @returns
   */
  loadProgram(bytes: ArrayLike<number>): Result<void, string> {
    // ohhhshit.
    // forgot to use assembler.
    let codeBuf = this.#assemblerInternal
      .getAllocator()
      .findProtectedBuffer("code");
    if (!codeBuf) return Err("codebuf doesn't exist. allocate necessary");

    return Ok(codeBuf.some.window.set(bytes));
  }

  run(): void {
    let firstStep = this.step(1);
    while (firstStep.value !== true) {
      if (isErr(firstStep)) {
        console.error("vm error:", (firstStep.value! as VMError).message);
        return;
      }
      firstStep = this.step();
    }
  }

  on() {
    this.#state = "ON";
  }

  step(times: number = 1): Result<boolean, VMError | null> {
    if (this.#state === "OFF") return Err(null);

    for (let i = 0; i < times; i++) {
      let cur = this.reader.getCurrentByte();

      if (!cur)
        return Err(
          VMError(
            this.getState(),
            `Pointer ${this.reader.getCurrentAddress()} memory access violation.`,
          ),
        );
      if (this.#instructions.has(cur)) {
        const fn = this.#instructions.get(cur)!;
        const res = fn(this);

        if (res) {
          this.reader.setAddress(res.some);
        } else {
          this.reader.readOne();
        }

        if (this.getState() === "OFF") return Ok(true);
      }
    }

    return Ok(false);
  }

  pop(): number | undefined {
    return this.reader.stackPop();
  }

  isOn() {
    return this.#state === "ON";
  }

  isOff() {
    return this.#state === "OFF";
  }

  turnOff() {
    this.#state = "OFF";
  }

  setInstructionSet(set: InstructionSet) {
    this.#instructions.clear();
    Object.entries(set).forEach(([key, value]) => {
      this.#instructions.set(Number(key), value);
    });
  }
}
