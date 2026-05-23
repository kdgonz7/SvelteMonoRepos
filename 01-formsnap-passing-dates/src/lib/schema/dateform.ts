import z from 'zod';

export const DateForm = z.object({
    title: z.string().min(1, "Task title must exist"),
    firstDate: z.string("First date must be a valid date"),
});