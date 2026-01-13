import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IProfile } from "./profile.interface";
import { Profile } from "./profile.model";
import httpStatus from "http-status-codes";

export const updateProfile = async (userId: string, payload: Partial<IProfile>) => {
    const existingProfile = await Profile.findOne({ user: userId });

    if (!existingProfile) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }

    if (!payload.profilePhoto) {
        payload.profilePhoto = existingProfile.profilePhoto;
    } else {
        // Delete old image from Cloudinary if new one is uploaded
        if (existingProfile.profilePhoto) {
            await deleteImageFromCloudinary(existingProfile.profilePhoto);
        }
    }

    const updatedProfile = await Profile.findOneAndUpdate({ user: userId }, payload, {
        new: true,
        runValidators: true,
    });

    return updatedProfile;
};

const getUserProfile = async (userId: string) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    const userProfile = await Profile.findOne({ user: isUserExist._id }).populate(
        "user",
        "email role status fullName"
    );

    return userProfile;
};

export const ProfileService = {
    updateProfile,
    getUserProfile,
};
