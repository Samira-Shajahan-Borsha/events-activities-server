import z from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createUserZodSchema = z.object({
    fullName: z
        .string()
        .min(2, { error: "Name is required and must be at least 2 characters long." })
        .max(50, { error: "Name cannot exceed 50 characters." })
        .nonempty(),
    email: z.email({ pattern: emailRegex }).nonempty("Email is required").readonly(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
            /[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`]/,
            "Password must contain at least one special character"
        )
        .nonempty("Password is required"),
});
