import { z } from "zod";

export const updateProfileZodSchema = z.object({
    location: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    interests: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.split(",").every((i) => i.trim().length > 0),
            "Invalid interests format"
        ),
});
