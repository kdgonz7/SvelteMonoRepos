# SaSHA Assembler

The SaSHA assembler is a part of the SaSHA language toolchain that turns LunarRED assembler into a valid SaSHA bytecode executable.

```assembly
.data:
	$string "Hello, world!"

.code:
	// load the string into the data segment, and push it onto the stack
	load $string
	// print the string
	print
	// halt the program
	halt
```
