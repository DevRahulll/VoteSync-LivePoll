import type { Request, Response, NextFunction } from "express";
import User from "./model.js";
import ApiError from "../../common/utils/ApiError.js";
import ApiResponse from "../../common/utils/ApiResponse.js";
import { verifyAccessToken } from "../../common/utils/token.js";

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            accessToken = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.accessToken) {
            accessToken = req.cookies.accessToken;
        }

        if (!accessToken) {
            throw new ApiError(401, "Token not found");
        }

        const decoded = verifyAccessToken(accessToken);
        const userId = (decoded as { userId: string }).userId;

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(ApiResponse.error(error.message));
        }
        return res
            .status(401)
            .json(ApiResponse.error("Invalid or expired Tokens"));
    }
};

export default authUser;
