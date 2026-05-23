import { IVT } from "../language/bytecode/ivtt";

type FileEndpoint = {
  display: (offset: number, length: number) => void;
  write: (bytes: number[]) => void;
  data: number[];
};

export class SiaxExecutionContext {
  #fds: Map<number, FileEndpoint> = new Map();
  #currentContext: number | null = null;

  getFileDescriptor(at: number) {
    return this.#fds.get(at);
  }
  populateDefaultEndpoints() {
    this.registerFd(1, {
      data: [],

      display(offset: number, length: number) {
        console.log("test stdout", offset);
      },

      write(bytes: number[]) {
        this.data.push(...bytes);
        console.log("WRITE", bytes);
      },
    });
  }
  reset() {
    this.#fds.clear();
  }
  registerFd(id: number, func: FileEndpoint) {
    this.#fds.set(id, func);
  }

  executeBytecode(bytecode: Array<number>) {
    let cursor: number = 0;

    while (cursor < bytecode.length) {
      console.log("BYTE", bytecode[cursor]);
      if (Object.values(IVT).includes(bytecode[cursor])) {
        // we have valid instruction
        switch (bytecode[cursor]) {
          case IVT.openfd:
            // "opens a file descriptor"
            let fd = bytecode[++cursor];
            this.#currentContext = fd;
            break;

          case IVT.writefd:
            // "writes to closest file descriptor"
            // simple.
            // length byte
            // length bytes to write
            const len = bytecode[++cursor];
            const bytes = bytecode.slice(cursor + 1, cursor + 1 + len);

            if (!this.#fds.has(this.#currentContext!)) break;
            this.#fds.get(this.#currentContext!)!.write(bytes);
            break;
        }
      }
      cursor++;
    }
  }
}
