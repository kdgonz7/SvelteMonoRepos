<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import { DateForm } from '$lib/schema/dateform';
    import { superForm } from 'sveltekit-superforms';
    import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
    import type { PageProps } from './$types';
    import { FieldGroup } from '$lib/components/ui/field';
    import * as Popover from '$lib/components/ui/popover';
    import { Calendar } from '$lib/components/ui/calendar';
    import {
        CalendarDate,
        getLocalTimeZone,
        type DateValue,
    } from '@internationalized/date';
    import Button from '$lib/components/ui/button/button.svelte';
    import { testFunction } from '$lib/api/formyfunc.remote';
    import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
    import { Input } from '$lib/components/ui/input';
    import Label from '$lib/components/ui/label/label.svelte';
    import { toast } from 'svelte-sonner';
    import z from 'zod';

    let { data }: PageProps = $props();
    let calendarValue = $state<DateValue | undefined>();
    let title = $state<string>('');

    async function handleSubmit() {
        try {
            await testFunction({
                title,
                testDate: calendarValue?.toString(),
            });

            toast.success('Query Good!', {
                description: 'Server received your inputs.',
            });
        } catch (error: any) {
            console.log(error);
            // toast.error('Query Failed', {
            //     description: `Something went wrong in your ${error[0].path[0]} field: ${error[0].message}.`,
            // });
        }
    }
</script>

<div class="flex place-items-center flex-col min-h-screen justify-center">
    <Card.Root class="max-w-lg w-full">
        <Card.Header>
            <Card.Title>Here's a form!</Card.Title>
            <Card.Description
                >Input a date using the popover, also input a text for some
                testing.</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <FieldGroup>
                <div class="flex flex-row gap-6">
                    <div class="flex flex-col gap-4">
                        <Label>Title of Payload</Label>
                        <Input
                            bind:value={title}
                            type="text"
                            placeholder="My Title"
                        />
                    </div>
                    <div class="flex flex-col gap-4">
                        <Label>Date</Label>
                        <Popover.Root>
                            <Popover.Trigger>
                                {#snippet child({ props })}
                                    <Button {...props}>
                                        {calendarValue
                                            ? `Selected: ${new Intl.DateTimeFormat(
                                                  'en-US',
                                                  {
                                                      weekday: 'long',
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                  },
                                              ).format(
                                                  calendarValue.toDate(
                                                      getLocalTimeZone(),
                                                  ),
                                              )}`
                                            : 'Check Date'}
                                    </Button>
                                {/snippet}
                            </Popover.Trigger>
                            <Popover.Content>
                                <Calendar
                                    bind:value={calendarValue}
                                    type="single"
                                    class="border rounded-md"
                                />
                            </Popover.Content>
                        </Popover.Root>
                    </div>
                </div>
                <Button onclick={handleSubmit}>Submit</Button>
            </FieldGroup>
        </Card.Content>
        <Card.Footer>
            <p>Card Footer</p>
        </Card.Footer>
    </Card.Root>
</div>
