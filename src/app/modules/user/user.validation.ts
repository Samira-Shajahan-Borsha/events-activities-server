import z from "zod";
import { ROLE, STATUS } from "./user.interface";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createUserZodSchema = z.object({
    email: z.email({ pattern: emailRegex }).nonempty("Email is required"),
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
