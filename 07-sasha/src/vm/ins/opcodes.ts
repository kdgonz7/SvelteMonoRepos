/**
 * An opcode is a recognized byte in a sequence of bytes.
 * Each opcode is responsible for doing some sort of functionality within a program.
 */
export type OpCode = number;
export const standardOpCodes = {
  PUSH: 0x01, // PUSH [value] push value to the stack
  POP: 0x02, // POP value from top of stack
  ADD: 0x03, // ADD (stack, pop 2 numbers push result)
  DEBUG: 0x04, // print the top value in the stack.
  CALL: 0x06, // CALL [addr.] Move CPU pointer to address and return back once RET called
  RET: 0x07, // RET Return to address on stack
  JMP: 0x08, // JMP [addr.] Make a one-way trip to address.
  HALT: 0x05, // exit the application.
};
