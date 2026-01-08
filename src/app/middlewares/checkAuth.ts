import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";

export const checkAuth =
    (...authRole: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers.authorization || req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, "No token received");
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN_SECRET);

        const isUserExist = await User.findById(verifiedToken.userId);

        // console.log(isUserExist, "User from middleware");

        if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
        }

        // After login, if the user account is blocked, the token will be sent from backend.
        // Frontend will handle it by redirecting it to a dedicated page "/account-status".

        if (isUserExist.isDeleted) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "User account is deleted. Please contact with support"
            );
        }

        // console.log(verifiedToken, "verifiedToken");

        if (!authRole.includes(verifiedToken.role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "You are not permitted to access this route"
            );
        }

        req.user = verifiedToken;

        next();
    };
