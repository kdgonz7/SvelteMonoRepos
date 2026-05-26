<script lang="ts">
  import { loginSchema } from "@svmrp/schemas";
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
  import FieldDescription from "$lib/components/ui/field/field-description.svelte";
  import FormButton from "$lib/components/ui/form/form-button.svelte";

  let { data }: PageProps = $props();

  let form = superForm(data.form, {
    validators: zod4Client(loginSchema),
  });
  let { form: formData, enhance } = form;
</script>

<div class="w-full h-screen flex items-center justify-center">
  <Card class="w-full max-w-xl">
    <CardHeader>
      <CardTitle>Log in</CardTitle>
      <CardDescription>Log in to MyNike orgs.</CardDescription>
    </CardHeader>
    <CardContent>
      <form method="POST" use:enhance>
        <FieldGroup>
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

          <FormButton class="w-full">Submit</FormButton>
          <FieldDescription>
            Don't have an account? <a href="/signup">Sign up.</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</div>
