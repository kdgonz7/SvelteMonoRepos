// SaSHA types

/**
 * A page is an array of bytes to define either a program, memory, or information, following the Vonn Neumann model.
 */
export type Page = Uint8Array;

/**
 * A memory address is an index of a page. In a program,
 * this is called the PC, and is used to handle things like calling different functions, managing memory, etc.
 */
export type Address = number;
