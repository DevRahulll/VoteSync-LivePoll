import express, { type Response } from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./module/auth/routes.js";
import { success } from "zod";

const createApp = () => {
    const app = express();

    app.use(express.json({ limit: "250kb" }));
    app.use(cookieParser());

    app.use("/api/auth", authRoutes);

    app.get("/health", (req, res) => {
        res.json({
            status: "ok",
            uptime: process.uptime(),
        });
    });

    app.use(
        (
            err: unknown,
            req: express.Request,
            res: Response,
            next: express.NextFunction,
        ) => {
            if (res.headersSent) {
                return next(err);
            }

            console.error("Unhandled application error:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        },
    );

    return app;
};

export default createApp;
