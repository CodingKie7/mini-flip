import { z } from "zod";

export const userSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "name must contain at least 2 characters"),
    age: z
        .number()
        .int("Age must be a whole number")
        .positive("Age must be greater than zero")
        .max(120, "Please enter a realistic age")
});