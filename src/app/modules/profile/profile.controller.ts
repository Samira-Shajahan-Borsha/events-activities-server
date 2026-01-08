import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ProfileService } from "./profile.service";
import { IProfile } from "./profile.interface";

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;

    // console.log({
    //     file: req.file,
    //     body: req.body,
    // });

    const payload: Partial<IProfile> = {
        ...req.body,
        interests: req.body.interests
            ? req.body.interests.split(",").map((i: string) => i.trim())
            : [],
        profilePhoto: req.file?.path ? req.file?.path : null,
    };

    // console.log("payload", payload);

    const result = await ProfileService.updateProfile(decodedToken.userId, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

export const ProfileController = {
    updateProfile,
};
