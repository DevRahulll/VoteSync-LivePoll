import z from "zod";

export const signupSchema = z.object({
    fullName: z.string().min(3, {
        message: "Full Name must be atleast 3 character long",
    }),

    email: z.email({
        message: "Invalid email address",
    }),

    password: z.string().min(5, {
        message: "Password must be at least 5 characters long",
    }),
});
