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

export const signinSchema = z.object({
    email: z.email({ message: "Invalid emmail" }),
    password: z
        .string()
        .min(5, { message: "Password must be 5 long character" }),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, {
        message: "Refresh Token is required",
    }),
});
