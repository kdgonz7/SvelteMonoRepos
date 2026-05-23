<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { ChevronDown } from "@lucide/svelte";
  import Button from "../ui/button/button.svelte";
  import type { Task } from "$lib/server/db/schema";
  import { changeTaskStatus } from "$lib/api/status.remote";
  import { invalidateAll } from "$app/navigation";
  import { getAllTasks } from "$lib/api/access.remote";

  interface TaskStatusProps {
    task: Task;
  }

  let { task }: TaskStatusProps = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} type="submit"><ChevronDown /> {task.status}</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Change Status</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        onclick={async () => {
          await changeTaskStatus({
            id: task.id,
            newStatus: "unfinished",
          });

          void getAllTasks().refresh();
        }}
      >
        Unfinished
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onclick={async () => {
          await changeTaskStatus({
            id: task.id,
            newStatus: "in_progress",
          });

          void getAllTasks().refresh();
        }}
      >
        In Progress
      </DropdownMenu.Item>

      <DropdownMenu.Item
        onclick={async () => {
          await changeTaskStatus({
            id: task.id,
            newStatus: "done",
          });

          void getAllTasks().refresh();
        }}
      >
        Done
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
<!--
fetch("http://localhost:5173/_app/remote/a58s9s/changeTaskStatus", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"148\", \"Microsoft Edge\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-sveltekit-pathname": "/",
    "x-sveltekit-search": ""
  },
  "referrer": "http://localhost:5173/",
  "body": "{\"payload\":\"W3siaWQiOjEsIm5ld1N0YXR1cyI6Mn0sIjA4NWYzZWNkLTMxMWYtNGEzMy1hMmI4LWFjYjczZWUwNzQxNiIsInVuZmluaXNoZWQiXQ\",\"refreshes\":[]}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

-->
