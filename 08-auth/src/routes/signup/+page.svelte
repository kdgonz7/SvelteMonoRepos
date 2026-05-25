<script lang="ts">
  import { signupSchema } from "@svmrp/schemas";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { FieldGroup } from "$lib/components/ui/field";
  import { FormField, FormControl, FormLabel } from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import FormFieldErrors from "$lib/components/ui/form/form-field-errors.svelte";

  let { data }: PageProps = $props();

  let form = superForm(data.form, {
    validators: zod4Client(signupSchema),
  });
  let { form: formData, enhance } = form;
</script>

<div class="w-full h-screen flex items-center justify-center">
  <Card class="w-full max-w-xl">
    <CardHeader>
      <CardTitle>Sign Up</CardTitle>
      <CardDescription>
        Sign up for an account to test my authentication skills.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form method="POST" use:enhance>
        <FieldGroup>
          <FormField {form} name="username">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel for={props.id}>Username</FormLabel>
                <Input {...props} type="text" bind:value={$formData.username} />
              {/snippet}
            </FormControl>
            <FormFieldErrors />
          </FormField>
          <FormField {form} name="email">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel for={props.id}>E-Mail</FormLabel>
                <Input {...props} type="email" bind:value={$formData.email} />
              {/snippet}
            </FormControl>
            <FormFieldErrors />
          </FormField>
          <FormField {form} name="password">
            <FormControl>
              {#snippet children({ props })}
                <FormLabel for={props.id}>Password</FormLabel>
                <Input
                  {...props}
                  type="password"
                  bind:value={$formData.password}
                />
              {/snippet}
            </FormControl>
            <FormFieldErrors />
          </FormField>

          <Button class="w-full">Submit</Button>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</div>
