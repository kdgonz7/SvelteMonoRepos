<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageProps } from './$types';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { DataSchema } from '$lib/dataschema';
    import FieldGroup from '$lib/components/ui/field/field-group.svelte';
    import * as Form from '$lib/components/ui/form';
    import * as Popover from '$lib/components/ui/popover';
    import { Button } from '$lib/components/ui/button';
    import Input from '$lib/components/ui/input/input.svelte';
    import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
    import { Calendar } from '$lib/components/ui/calendar';
    import { CalendarDate } from '@internationalized/date';
    import * as Card from '$lib/components/ui/card';

    let { data }: PageProps = $props();
    let form = superForm(data.form, {
        validators: zod4Client(DataSchema),
    });

    let { enhance, form: fields } = form;
    let value = $state<CalendarDate | undefined>();
    let calendarAsISO = $derived.by<string | undefined>(() => {
        console.log(value);
        return value?.toString();
    });
</script>

<div class="flex place-items-center min-h-screen w-full justify-center">
    <Card.Root class="max-w-xl w-full">
        <Card.Header>
            <Card.Title>Card Title</Card.Title>
            <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content>
            <form method="POST" use:enhance>
                <FieldGroup>
                    <Form.Field {form} name="title">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Title</Form.Label>
                                <Input
                                    type="text"
                                    bind:value={$fields.title}
                                    required
                                    placeholder="Task title"
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <Form.Field {form} name="date">
                        <Form.Control>
                            {#snippet children({ props })}
                                <input
                                    type="hidden"
                                    bind:value={calendarAsISO}
                                    {...props}
                                />

                                <Form.Label>Input Date</Form.Label>

                                <Popover.Root>
                                    <Popover.Trigger
                                        >{#snippet child({ props })}<Button
                                                {...props}>Change shit!</Button
                                            >{/snippet}</Popover.Trigger
                                    >
                                    <Popover.Content>
                                        <Calendar
                                            bind:value
                                            type="single"
                                            class="border rounded-md"
                                        />
                                    </Popover.Content>
                                </Popover.Root>
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </FieldGroup>
                <Form.Button>Submit Info</Form.Button>
            </form>
        </Card.Content>
        <Card.Footer>
            <p>Card Footer</p>
        </Card.Footer>
    </Card.Root>
</div>
