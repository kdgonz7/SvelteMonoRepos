import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  if (!locals.session.user) {
    throw redirect(300, "/signup");
  }
}) satisfies PageServerLoad;
