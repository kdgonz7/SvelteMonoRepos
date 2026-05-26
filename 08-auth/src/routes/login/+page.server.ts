import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { loginSchema } from "@svmrp/schemas";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

export const load = (async () => {
  return {
    form: await superValidate(zod4(loginSchema)),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    let form = await superValidate(event, zod4(loginSchema));
    if (!form.valid) return fail(400, { form });

    let { email, password } = form.data;
    try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });
    } catch (e) {
      console.error("Sign in error:", e);
      return fail(400, { form, error: "Invalid email or password" });
    }

    throw redirect(308, "/");
  },
} satisfies Actions;
