/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (envVars.NODE_ENV === "development") {
        console.log("❌ Global Error: ", err);
    }

    if (req.file) {
        await deleteImageFromCloudinary(req.file?.path);
    }

    if (req.files && Array.isArray(req.files) && req.files?.length) {
        const imageUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
        await Promise.all(imageUrls.map((url) => deleteImageFromCloudinary(url)));
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
