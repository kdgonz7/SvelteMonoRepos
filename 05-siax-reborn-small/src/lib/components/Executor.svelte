<script lang="ts">
    import { SiaxBytecodeGenerator } from "$lib/siax/language/bytecode/generate";
    import { SiaxExecutionContext } from "$lib/siax/runtime/exec";
    import { onMount } from "svelte";
    import Button from "./ui/button/button.svelte";
    import {
        Card,
        CardHeader,
        CardTitle,
        CardDescription,
        CardContent,
    } from "./ui/card";
    import { TableHead, TableHeader } from "./ui/table";
    import TableCell from "./ui/table/table-cell.svelte";
    import TableRow from "./ui/table/table-row.svelte";
    import Table from "./ui/table/table.svelte";
    let { code = $bindable() } = $props();

    let output = $state("No output");

    const byteExecContext = new SiaxExecutionContext();
    const byteGenerator = new SiaxBytecodeGenerator();

    onMount(() => {
        // provides stdout
        byteExecContext.populateDefaultEndpoints();
    });

    async function executeSiax() {
        // code has siax code to run. run it.
        let generatedBytecode = byteGenerator.generateFromInput(code);
        if (generatedBytecode.tag === "ok") {
            byteExecContext.executeBytecode(
                generatedBytecode.value as number[],
            );
            console.log(byteExecContext);
            output = String.fromCharCode(
                ...byteExecContext.getFileDescriptor(1)!.data,
            );

            byteExecContext.reset();
            byteExecContext.populateDefaultEndpoints();
        } else {
            console.log("bytecode error:", generatedBytecode.value);
            return;
        }
    }
</script>

<Card class="max-w-3xl w-full h-full">
    <CardHeader>
        <CardTitle>SiAX Executor</CardTitle>
        <CardDescription>See a SiAX program run live.</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-2 w-full">
        <span class="font-bold tracking-tight text-lg"
            >Inputted code (From Language tab)</span
        >
        <code class="bg-background outline p-2 rounded-md mb-1">
            {code.length > 0 ? code : "No Code"}
        </code>
        <div class="flex flex-row gap-2">
            <Button onclick={executeSiax}>Run</Button>
        </div>
        <span class="font-bold tracking-tight text-lg">Program output</span>
        <code class="bg-background outline p-2 rounded-md mb-6">
            {output.length > 0 ? output : "No Code"}
        </code>

        <span class="font-bold tracking-tight text-lg">File Descriptors</span>
        <Table>
            <TableHeader>
                <TableHead>File Descriptor</TableHead>
                <TableHead colspan={2}>Usage</TableHead>
            </TableHeader>
            <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Standard Output</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>2</TableCell>
                <TableCell>Standard Input (unused)</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>3</TableCell>
                <TableCell>Standard Error (unused)</TableCell>
            </TableRow>
        </Table>
    </CardContent>
</Card>
