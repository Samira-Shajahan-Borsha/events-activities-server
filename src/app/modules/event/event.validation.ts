import { z } from "zod";

export const createEventZodSchema = z.object({
    name: z.string().nonempty("Event name is required"),
    type: z.string().nonempty("Event type is required"),
    description: z.string().nonempty("Description is required"),
    image: z.string().nonempty("Event image is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    location: z.string().nonempty("Location is required"),
    minParticipants: z.number().min(1, "Minimum participants must be at least 1").optional(),
    maxParticipants: z.number().min(1, "Maximum participants must be at least 1").optional(),
    joiningFee: z.number().min(0, "Joining fee cannot be negative").optional().default(0),
    isFeatured: z.boolean().optional().default(false)
});


export const updateEventZodSchema = z.object({
    name: z.string().nonempty("Event name cannot be empty").optional(),
    type: z.string().nonempty("Event type cannot be empty").optional(),
    description: z.string().nonempty("Description cannot be empty").optional(),
    image: z.string().nonempty("Event image cannot be empty").optional(),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
    location: z.string().nonempty("Location cannot be empty").optional(),
    minParticipants: z.number().min(1, "Minimum participants must be at least 1").optional(),
    maxParticipants: z.number().min(1, "Maximum participants must be at least 1").optional(),
    joiningFee: z.number().min(0, "Joining fee cannot be negative").optional(),
    isFeatured: z.boolean().optional(),
    host: z.string().nonempty("Host ID cannot be empty").optional(),
});
