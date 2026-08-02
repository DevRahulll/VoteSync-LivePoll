import { type Request, type Response } from "express";
import { signupSchema } from "./validator.js";
import type { ZodError } from "zod";
import ApiResponse from "../../common/utils/ApiResponse.js";
import ApiError from "../../common/utils/ApiError.js";
import { signupService } from "./services.js";

export const signup = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    //zod validation (safeparse)
    const result = await signupSchema.safeParseAsync({
        fullName,
        email,
        password,
    });
    if (!result.success) {
        const errors = (result.error as ZodError).issues.map((err) => ({
            field: err.path.join(". "),
            message: err.message,
        }));

        return res
            .status(400)
            .json(ApiResponse.error("Validation failed", errors));
    }

    //call services
    try {
        const userData = await signupService(fullName, email, password);

        return res
            .status(201)
            .json(
                ApiResponse.success("User registered successfully", userData),
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        console.error("Signup error:", error);
        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};
