<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import type { Task } from "$lib/server/db/schema";
  import { Ellipsis } from "@lucide/svelte";
  import { deleteTask } from "$lib/api/access.remote";
  import { invalidateAll } from "$app/navigation";

  let { task }: { task: Task } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Ellipsis />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Task Stuff</DropdownMenu.Label>
      <DropdownMenu.Item
        onclick={async () => {
          console.log("ID Passed:", task.id);
          await deleteTask(task.id);
          invalidateAll();
        }}>Delete</DropdownMenu.Item
      >
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
