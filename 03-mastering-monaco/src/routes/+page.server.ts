import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { FormScheme } from "$lib/schema/test-schema";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
export const load = (async () => {
  let form = await superValidate(zod4(FormScheme));
  return { form };
}) satisfies PageServerLoad;
