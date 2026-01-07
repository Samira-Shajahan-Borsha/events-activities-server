import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

export const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (envVars.NODE_ENV === "development") {
        console.log("❌ Global Error: ", err);
    }

    let statusCode = 500;
    let message = "Something Went Wrong!!";

    res.status(statusCode).json({
        success: false,
        message,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
