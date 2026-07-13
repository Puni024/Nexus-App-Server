import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({
        message: "Please enter a valid email",
    }),

    password: z.string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
            "Password must contain at least one letter, one number, and one special character"
        ),
});