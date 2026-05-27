import { Some, type Optional, type Potential } from "../../shared/potential";
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
export type AllocatorLayout = Record<
  string,
  {
    size: number;
    type: "readonly" | "write" | "prog";
  }
>;

export const defaultAllocatorLayout: AllocatorLayout = {
  code: {
    size: 1024,
    type: "prog",
  },
  data: {
    size: 1024,
    type: "write",
  },
};

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

    if (instructions) {
      this.setInstructionSet(instructions);
    }
  }

  setInstructionSet(set: InstructionSet) {
    this.#instructions.clear();
    Object.entries(set).forEach(([key, value]) => {
      this.#instructions.set(Number(key), value);
    });
  }
  /**
   * Allocates areas for the VM to have access to. Contains things like a "data" region, "code", etc.
   * @param layout The layout for the memory areas
   * @returns nothing.
   */
  allocateAreas(
    layout: AllocatorLayout = defaultAllocatorLayout,
  ): Potential<string> {
    for (const [name, info] of Object.entries(layout)) {
      let e = this.#assemblerInternal.allocateSegment(
        name,
        info.size,
        info.type,
      );
      if (isErr(e)) {
        return Err(`VM unable to allocate memory for ${name}`);
      }
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

  /**
   * @returns stackpop from this.reader
   */
  pop(): number | undefined {
    return this.reader.stackPop();
  }

  push(arg0: number) {
    this.reader.stackPush(arg0);
  }

  isOn() {
    return this.#state === "ON";
  }

  isOff() {
    return this.#state === "OFF";
  }

  getState(): VMState {
    return this.#state;
  }

  turnOff() {
    this.#state = "OFF";
  }

  turnOn() {
    this.#state = "ON";
  }
}
