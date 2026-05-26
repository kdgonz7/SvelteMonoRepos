import type { Err } from "./result";

/**
 * A potential error. Something CAN go wrong.
 */
export type Potential<E> = void | Err<E>;
export type Optional<T> = null | { some: T };
