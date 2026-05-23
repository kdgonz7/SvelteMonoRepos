<script lang="ts">
  import { taskTableColumns } from "$lib/cols/task";
  import DataTable from "$lib/components/app/DataTable.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card/";
  import type { Task } from "$lib/server/db/schema";
  import * as Dialog from "$lib/components/ui/dialog/";
  import { getAllTasks } from "$lib/api/access.remote";
  import { Separator } from "$lib/components/ui/separator";
  import { FieldGroup } from "$lib/components/ui/field";
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import z from "zod";
  import { createTask } from "$lib/api/create.remote";
  import FormField from "$lib/components/ui/form/form-field.svelte";
  import { FieldErrors, FormControl, FormLabel } from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import FormButton from "$lib/components/ui/form/form-button.svelte";

  const TaskCreationSchema = z.object({
    title: z.string().min(3, "tasks require a minimum length of 3 for title."),
    priority: z
      .number("priority must be a valid number.")
      .min(1, "priority must be greater than one")
      .max(5, "priority must be less than 5."),
  });

  let form = superForm(defaults(zod4(TaskCreationSchema)), {
    SPA: true,
    validators: zod4(TaskCreationSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        await createTask({
          title: form.data.title,
          priority: form.data.priority,
        });
      }
    },
  });

  let { form: formData, enhance } = form;
</script>

<Dialog.Root
  onOpenChange={(o) => {
    if (!o) form.reset();
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create new task</Dialog.Title>
      <Dialog.Description
        >Here is where you can create new tasks.</Dialog.Description
      >
    </Dialog.Header>
    <div>
      <!-- Guilty confession, there is no need for this div... i'm just scared -->
      <form use:enhance method="POST">
        <FieldGroup>
          <FormField {form} name="title">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel>Task Title</FormLabel>
                <Input {...props} bind:value={$formData.title} type="text" />
              {/snippet}
            </FormControl>
            <FieldErrors />
          </FormField>
          <FormField {form} name="priority">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel>Task Priority</FormLabel>
                <Input
                  {...props}
                  bind:value={$formData.priority}
                  type="number"
                />
              {/snippet}
            </FormControl>
            <FieldErrors />
          </FormField>
          <FormButton>Submit!</FormButton>
        </FieldGroup>
      </form>
    </div>
  </Dialog.Content>
  <div class="w-full h-screen flex items-center justify-center">
    <Card.Root class="w-87.5">
      <Card.Header>
        <Card.Title>Task Table</Card.Title>
        <Card.Description>Here's a fun little task table.</Card.Description>
      </Card.Header>
      <Card.Content class="flex flex-col gap-4">
        <DataTable columns={taskTableColumns} data={await getAllTasks()} />

        <Separator />

        <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
          Add Task
        </Dialog.Trigger>
      </Card.Content>
    </Card.Root>
  </div>
</Dialog.Root>
