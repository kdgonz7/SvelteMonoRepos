import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { DateForm } from '$lib/schema/dateform';
import { zod4 } from "sveltekit-superforms/adapters";
import { fail } from '@sveltejs/kit';

export const load = (async () => {
    let form = await superValidate(zod4(DateForm));
    return { form };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        let form = await superValidate(event, zod4(DateForm));

        if (!form.valid) {
            console.log("Errors:", form.errors);
            return fail(400, { form });
        }
        console.log("Inputted date:", form.data.firstDate);
        return { form };
    }
} satisfies Actions;