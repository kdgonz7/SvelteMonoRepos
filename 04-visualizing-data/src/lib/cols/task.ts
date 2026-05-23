import TaskDropdownMenu from "$lib/components/table/TaskDropdownMenu.svelte";
import TaskStatusDropdownSvelte from "$lib/components/table/TaskStatusDropdown.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { Task } from "$lib/server/db/schema";
import type { ColumnDef } from "@tanstack/table-core";

export const taskTableColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return renderComponent(TaskStatusDropdownSvelte, {
        task: row.original,
      });
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return renderComponent(TaskDropdownMenu, {
        task: row.original,
      });
    },
  },
];
