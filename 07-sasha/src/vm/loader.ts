// loader ->
// should be a class to load in bytecode, hold a reference to it, layer bytes, and remove them.

import type { Address, Page } from "./types";

/**
 * Loader handles the bytecode transformation, the PC, and the access.
 *
 * * `getCurrentAddress()` -> Program Counter
 * * `getCurrentByte()` -> Bytes[PC]
 */
export class Loader {
	#bytecode: Page;
	#pc: number = 0;
	#sp: number;

	constructor(pageSize: number = 65536) {
		this.#bytecode = new Uint8Array(pageSize);
		this.#pc = 0;
		this.#sp = pageSize - 1;
	}

	getCurrentAddress(): number {
		return this.#pc;
	}

	getCurrentByte(): number | null | undefined {
		if (this.hasInvalidProgramState()) return null;
		return this.#bytecode[this.#pc];
	}

	/**
	 * Read amount bytes and return them, while advancing the program pointer.
	 * @param amount
	 * @returns
	 */
	readNext(amount: number): Uint8Array<ArrayBuffer> | null {
		if (this.hasInvalidProgramState()) return null;
		if (this.#pc + amount > this.#bytecode.length) return null;

		const bytes = this.#bytecode.slice(this.#pc, this.#pc + amount);
		this.#pc += amount;

		return bytes;
	}

	goToAddress(address: Address): void {
		this.#pc = address;
	}

	/**
	 *
	 * @returns is the program counter larger than the memory?
	 */
	hasInvalidProgramState(): boolean {
		return this.#pc >= this.#bytecode.length;
	}

	/**
	 * Will return `true` if we can advance to the next byte in the bytecode program.
	 * @returns
	 */
	canAdvance(): boolean {
		return this.#pc + 1 <= this.#bytecode.length;
	}

	/**
	 * Load bytes into the current bytecode context, starting from offset, which by default is 0.
	 * @param prog
	 */
	loadBytes(prog: ArrayLike<number>, offset: number = 0): void {
		this.#bytecode.set(prog, offset);
	}

	/**
	 * Pushes a byte into the stack, decrementing stack pointer.
	 * @param byte
	 */
	stackPush(byte: number): void {
		this.#sp--;
		this.#bytecode[this.#sp] = byte;
	}

	/**
	 * Pops a byte from the stack, returning it.
	 * @returns stack popped value
	 */
	stackPop(): number | undefined {
		let stackPointed = this.#bytecode[this.#sp];
		this.#bytecode[this.#sp] = 0; // clear the byte after popping
		this.#sp++;

		return stackPointed;
	}
}
