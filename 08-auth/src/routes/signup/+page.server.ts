import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { signupSchema } from "@svmrp/schemas";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

export const load = (async () => {
  return {
    form: await superValidate(zod4(signupSchema)),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    let form = await superValidate(event, zod4(signupSchema));
    if (!form.valid) return fail(400, { form });

    return { form };
  },
} satisfies Actions;
