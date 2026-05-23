import { type SiaxAst } from "../parse/parseSiaxLanguage";
import { generateSiaxAst } from "../parse/ast";
import { IVT } from "./ivtt";

type Ok<T> = { tag: "ok"; value: T };
type Err<E> = { tag: "err"; value: E };
type Result<T, E> = Ok<T> | Err<E>;
export class SiaxBytecodeError {
  constructor(public message: string) {
    this.message = message;
  }
}

/** ## Generic 8-bit SiAX
 *
 * binary generator for your headtops.
 *
 * Constructor takes in a max size for bytecode, with a default of 1024, to define how large a program can possibly be.
 * Returning byte array 8-bit optimized.
 */
export class SiaxBytecodeGenerator {
  #max = 0;
  constructor(MAX_SIZE: number = 1024) {
    this.#max = MAX_SIZE;
  }
  generateFromInput(input: string) {
    let ast = generateSiaxAst(input);

    if (!input || !ast)
      return {
        tag: "err",
        value: new SiaxBytecodeError("Failed to parse input into AST."),
      };

    return this.generate(ast);
  }

  generate(ast: SiaxAst): Result<Array<number>, SiaxBytecodeError> {
    let bytes: number[] = [];
    let memory: Map<string, number> = new Map();
    let pointer: number = 0;

    ast.forEach((node) => {
      switch (node.type) {
        case "AssignmentExpression":
          if (
            node.identifier.type !== "Identifier" ||
            node.expr.type !== "Number" /* TODO: as more types ever spawn */
          )
            return;

          // limitation: no functions are currently allowed, and do not spawn anything useful.
          // should this change? who knows.
          // Siax never defined hardcore language rules for allocations, meaning they probably only happen within the VM.
          memory.set(node.identifier.value, node.expr.value);
          break;
        case "FunctionCall":
          if (node.functionName.type !== "Identifier")
            return {
              tag: "err",
              value: new SiaxBytecodeError("Function name must be identifier."),
            };

          const byteMap = IVT[node.functionName.value as keyof typeof IVT];
          console.log(byteMap, "fncall", node.functionName);

          if (byteMap !== undefined) {
            let callStack = node.functionParams.map((p) => {
              if (p.type !== "Number" && p.type === "Identifier") {
                if (memory.has(p.value)) {
                  return memory.get(p.value)!;
                } else {
                  return 0;
                }
              }

              if (p.type === "Number") return p.value;
              else return 0;
            }); // TODO: more types, and error handling for unsupported types.

            // lay the mapped function
            bytes[pointer] = byteMap;
            pointer++;

            // for each parameter that was in callstack, add that byte as well, or whatever it should evaluate to.
            callStack.forEach((param) => {
              bytes[pointer++] = param;
            });
          } else {
            return {
              tag: "err",
              value: new SiaxBytecodeError(
                `No such function '${node.functionName.value}'`,
              ),
            };
          }
          break;
      }
    });

    return {
      tag: "ok",
      value: bytes,
    };
  }
}
