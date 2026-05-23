import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { DataSchema } from '$lib/dataschema';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, type Actions } from '@sveltejs/kit';

export const load = (async () => {
    let form = await superValidate(zod4(DataSchema));
    return { form };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        let form = await superValidate(event, zod4(DataSchema));
        if (!form.valid) return fail(400, { form });
        console.log(form.data.date);
        return { form };
    }
} satisfies Actions;