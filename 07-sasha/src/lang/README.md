# SaSHA SVL

A tightly-knit, decoupled programming language designed to work flawlessly with the SaSHA VM.

```c
// ## SSVL
// strings are automatically encoded and added to the data segment, numbers work all the same, and you can use functions like normal.

[#lang(std)]
[#use(typehints, globals)]

int add(a: int, b: int) {
	return a + b;
}

void main() {
	// v has the frame pointer offset of 2, 5 = 0, and 3 = 1, so the stack frame for add is [5,3]
	var v = add(5,3);
	println(v);
}
```

## Parts

- `ast`: The AST for the SaSHA programming language. A crucial asset used for formatting, codegen, optimization, and language tools.
- `codegen`: The code generation for the language. Manages the values, virtual stack, and frame pointers.
