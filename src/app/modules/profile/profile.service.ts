import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { IProfile } from "./profile.interface";
import { Profile } from "./profile.model";
import httpStatus from "http-status-codes";

export const updateProfile = async (userId: string, payload: Partial<IProfile>) => {
    const existingProfile = await Profile.findOne({ user: userId });

    if (!existingProfile) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }

    const updatedProfile = await Profile.findOneAndUpdate({ user: userId }, payload, {
        new: true,
        runValidators: true,
    });

    // Delete image from Cloudinary
    if (payload.profilePhoto && existingProfile.profilePhoto) {
        await deleteImageFromCloudinary(existingProfile.profilePhoto);
    }

    return updatedProfile;
};

export const ProfileService = {
    updateProfile,
};
