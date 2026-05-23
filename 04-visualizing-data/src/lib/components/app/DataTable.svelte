<!--- Generic Data Table Component.
    Refined to be useful in multiple situations. Generic table values inputted, alongside settings.
-->

<script lang="ts" generics="TData, TValue">
  import * as Table from "$lib/components/ui/table/index.js";
  import { createSvelteTable, FlexRender } from "../ui/data-table";
  import {
    type ColumnDef,
    type ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
  } from "@tanstack/table-core";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let {
    data,
    columns,
    ...rest
  }: DataTableProps<TData, TValue> & { className?: string } = $props();
  let sortingState = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });

  const table = createSvelteTable({
    get data() {
      return data;
    },
    // svelte-ignore state_referenced_locally
    columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        sortingState = updater(sortingState);
      } else {
        sortingState = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    state: {
      get sorting() {
        return sortingState;
      },

      get columnFilters() {
        return columnFilters;
      },

      get pagination() {
        return pagination;
      },
    },
  });
</script>

<Table.Root>
  <Table.Header>
    {#each table.getHeaderGroups() as headerGroup}
      <Table.Row>
        {#each headerGroup.headers as header}
          <Table.Head colspan={header.colSpan}>
            {#if !header.isPlaceholder}
              <FlexRender
                content={header.column.columnDef.header}
                context={header.getContext()}
              />
            {/if}
          </Table.Head>
        {/each}
      </Table.Row>
    {/each}
  </Table.Header>
  <Table.Body>
    {#each table.getRowModel().rows as row (row.id)}
      <Table.Row data-state={row.getIsSelected() && "selected"}>
        {#each row.getVisibleCells() as cell}
          <Table.Cell>
            <FlexRender
              content={cell.column.columnDef.cell}
              context={cell.getContext()}
            />
          </Table.Cell>
        {/each}
      </Table.Row>
    {:else}
      <Table.Row>
        <Table.Cell colspan={columns.length}>No Results Found.</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
