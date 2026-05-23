import { command, form } from '$app/server';
import z from 'zod';

export const testFunction = command(z.object({
    title: z.string().min(3, "Minimum 3 chars"),
    testDate: z.string().optional(),
}), async ({ title, testDate }) => {
    console.log("Server gonna do shit now.");
    console.log(title);
    console.log(testDate);
});