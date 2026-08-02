import express from "express";

const createApp = () => {
    const app = express();

    app.use(express.json());

    app.get("/health", (req, res) => {
        res.json({
            status: "ok",
            uptime: process.uptime(),
        });
    });

    return app;
};

export default createApp;
