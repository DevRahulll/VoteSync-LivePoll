import "dotenv/config";
import { createServer } from "node:http";
import createApp from "./app/app.js";

const startServer = async () => {
    //connect to DB

    const app = createServer(createApp());
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV}`,
        );
    });
};

startServer();
