import z from 'zod';

export const DataSchema = z.object({
    title: z.string(),
    date: z.string(),
    shouldShow: z.boolean(),
});