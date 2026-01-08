import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import httpStatusCode from "http-status-codes";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(httpStatusCode.OK).json({
        message: "Welcome to events activities server",
        environment: envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString(),
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
