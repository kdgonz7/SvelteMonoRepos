<script lang="ts">
    import {
        getCoreRowModel,
        type PaginationState,
        type ColumnDef,
        getPaginationRowModel,
    } from "@tanstack/table-core";
    import { createSvelteTable } from "../ui/data-table";
    import { FlexRender } from "$lib/components/ui/data-table/";
    import {
        Table,
        TableHeader,
        TableRow,
        TableHead,
        TableBody,
        Cell,
    } from "../ui/table";
    import TableCell from "../ui/table/table-cell.svelte";
    import { cn } from "tailwind-variants";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import { Button } from "../ui/button";

    let { className }: { className?: string } = $props();

    type Object = {
        id: string;
        a: string;
        b: number;
    };

    let data: Object[] = [
        {
            id: crypto.randomUUID(),
            a: "John",
            b: 30,
        },
        {
            id: crypto.randomUUID(),
            a: "Jane",
            b: 25,
        },
        {
            id: crypto.randomUUID(),
            a: "Doe",
            b: 40,
        },
        {
            id: crypto.randomUUID(),
            a: "Doe",
            b: 40,
        },
        {
            id: crypto.randomUUID(),
            a: "Doe",
            b: 40,
        },
        {
            id: crypto.randomUUID(),
            a: "Doe",
            b: 40,
        },
        {
            id: crypto.randomUUID(),
            a: "Doe",
            b: 40,
        },
        {
            id: crypto.randomUUID(),
            a: "Doe",
            b: 40,
        },
    ];

    let columns: ColumnDef<Object>[] = [
        {
            accessorKey: "a",
            header: "Name",
        },
        {
            accessorKey: "b",
            header: "Age",
        },
    ];

    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
    const table = createSvelteTable({
        columns,
        get data() {
            return data;
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                pagination = updater(pagination);
            } else {
                pagination = updater;
            }
        },
        state: {
            get pagination() {
                return pagination;
            },
        },
    });
</script>

<div class={cn("rounded-md border p-2", className)}>
    <Table>
        <TableHeader>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <TableRow>
                    {#each headerGroup.headers as header (header.id)}
                        <TableHead colspan={header.colSpan}>
                            <FlexRender
                                content={header.column.columnDef.header}
                                context={header.getContext()}
                            />
                        </TableHead>
                    {/each}
                </TableRow>
            {/each}
        </TableHeader>
        <TableBody>
            {#each table.getRowModel().rows as row (row.id)}
                <TableRow>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <Cell>
                            <FlexRender
                                content={cell.column.columnDef.cell}
                                context={cell.getContext()}
                            ></FlexRender>
                        </Cell>
                    {/each}
                </TableRow>
            {:else}
                <TableRow>
                    <TableCell colspan={columns.length}>No results.</TableCell>
                </TableRow>
            {/each}
        </TableBody>
    </Table>
    <div class="flex flex-row gap-2 mt-2">
        <Button
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            onclick={() => {
                table.previousPage();
            }}
        >
            <ChevronLeft />
        </Button>

        <Button
            variant="outline"
            disabled={!table.getCanNextPage()}
            onclick={() => {
                table.nextPage();
            }}
        >
            <ChevronRight />
        </Button>
    </div>
</div>
