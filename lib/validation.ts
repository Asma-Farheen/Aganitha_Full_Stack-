import { z } from 'zod';

// Validation schema for creating a new link
export const createLinkSchema = z.object({
    targetUrl: z.string().url({ message: 'Please enter a valid URL' }),
    customCode: z
        .string()
        .regex(/^[A-Za-z0-9]{6,8}$/, {
            message: 'Code must be 6-8 alphanumeric characters',
        })
        .optional(),
});

// Validation schema for short code
export const codeSchema = z
    .string()
    .regex(/^[A-Za-z0-9]{3,10}$/, {
        message: 'Invalid code format',
    });

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
