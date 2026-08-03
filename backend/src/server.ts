import "./app/common/config/env.js";
import { createServer } from "node:http";
import createApp from "./app/app.js";
import connToDB from "./app/common/db/connToDB.js";

const startServer = async () => {
    //connect to DB
    await connToDB();

    const app = createServer(createApp());
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV}`,
        );
    });
};

startServer();
