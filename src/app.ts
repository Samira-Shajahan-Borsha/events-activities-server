import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import httpStatusCode from "http-status-codes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(httpStatusCode.OK).json({
        message: "Welcome to events activities server",
        environment: envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString(),
    });
});

export default app;
