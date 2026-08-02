import { type Request, type Response } from "express";
import { signinSchema, signupSchema } from "./validator.js";
import type { ZodError } from "zod";
import ApiResponse from "../../common/utils/ApiResponse.js";
import ApiError from "../../common/utils/ApiError.js";
import { signinService, signupService, toAuthUser } from "./services.js";
import { CookieConfiguration } from "../../common/config/cookies.config.js";
import User from "./model.js";

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

export const singnin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await signinSchema.safeParseAsync({ email, password });
    if (!result.success) {
        const errors = (result.error as ZodError).issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return res
            .status(400)
            .json(ApiResponse.error("Validation failed", errors));
    }

    try {
        const { accessToken, refreshToken, user } = await signinService(
            email,
            password,
        );
        const cookieMaxAge = {
            accessToken: 15 * 60 * 60 * 1000, // 15m
            refreshToken: 2 * 60 * 60 * 60 * 1000, // 2 h
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                ...CookieConfiguration,
                maxAge: cookieMaxAge.accessToken,
            })
            .cookie("refreshToken", refreshToken, {
                ...CookieConfiguration,
                maxAge: cookieMaxAge.refreshToken,
            })
            .json(
                ApiResponse.success("User signed in successfully", {
                    accessToken,
                    refreshToken,
                    user,
                }),
            );
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }

        console.error("Signin error:", error);

        return res.status(500).json(ApiResponse.error("Internal server error"));
    }
};

export const userProfile = async (req: Request, res: Response) => {
    return res.status(200).json(
        ApiResponse.success("User fetched successfully", {
            user: req.user ? toAuthUser(req.user) : null,
            accessToken:
                req.cookies.accessToken ||
                req.headers.authorization?.split(" ")[1],
        }),
    );
};

export const signOut = async (req: Request, res: Response) => {
    // also clear the refresh token from DB
    try {
        const user = req.user;
        if (user) {
            await User.findByIdAndUpdate(user._id, { refreshToken: null });
        }
    } catch (error) {
        console.error("Error in clearing refresh token", error);
    }

    res.clearCookie("accessToken", CookieConfiguration);
    res.clearCookie("refreshToken", CookieConfiguration);
    return res
        .status(200)
        .json(ApiResponse.success("User signed out successfully"));
};
