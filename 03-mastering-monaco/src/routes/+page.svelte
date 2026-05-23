<script lang="ts">
    import type { PageData, PageServerLoad } from "./$types";
    import * as Card from "$lib/components/ui/card";
    import FieldGroup from "$lib/components/ui/field/field-group.svelte";
    import FormField from "$lib/components/ui/form/form-field.svelte";
    import { FormScheme } from "$lib/schema/test-schema";
    import { zod4 } from "sveltekit-superforms/adapters";
    import { superForm } from "sveltekit-superforms";
    import FormLabel from "$lib/components/ui/form/form-label.svelte";
    import { FormControl } from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte";
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();

    let form = superForm(data.form, {
        validators: zod4(FormScheme),
    });
    let { enhance, form: formData } = form;
</script>

<div class="w-full h-screen place-items-center flex flex-col justify-center">
    <Card.Root class="max-w-lg w-full">
        <Card.Header>
            <Card.Title>Card form</Card.Title>
            <Card.Description
                >If there's anything you need, let me know.</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <form method="POST" use:enhance>
                <FieldGroup>
                    <FormField {form} name="title">
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>A sample field.</FormLabel>
                                <Input
                                    {...props}
                                    type="text"
                                    bind:value={$formData.title}
                                />
                            {/snippet}
                        </FormControl>
                    </FormField>

                    <Button class="w-full">Submit</Button>
                </FieldGroup>
            </form>
        </Card.Content>
        <Card.Footer></Card.Footer>
    </Card.Root>
</div>
