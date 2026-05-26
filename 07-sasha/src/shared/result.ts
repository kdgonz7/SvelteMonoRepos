export type Result<T, E> = Ok<T> | Err<E>;
export type Ok<T> = { ok: true; value: T };
export type Err<T> = { ok: false; value: T };

export const unwrap = <T, E>(r: Result<T, E>): T => {
  if (r.ok) {
    return r.value;
  } else {
    throw new Error(`Tried to unwrap an Err value: ${JSON.stringify(r.value)}`);
  }
};

export const Ok = <T>(value: T) => {
  return {
    ok: true,
    value,
  } as Ok<T>;
};

export const Err = <E>(value: E) => {
  return {
    ok: false,
    value,
  } as Err<E>;
};
