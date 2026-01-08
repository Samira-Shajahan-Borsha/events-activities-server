import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Profile } from "../profile/profile.model";
import mongoose from "mongoose";

const register = async (payload: IUser) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { email, password: plainPassword, role } = payload;

        const isUserExist = await User.findOne({ email }).session(session);

        if (isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(
            plainPassword as string,
            Number(envVars.BCRYPT_SALT_ROUND)
        );

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: email as string,
        };

        const createdUser = await User.create(
            [
                {
                    email,
                    password: hashedPassword,
                    auths: [authProvider],
                    role,
                },
            ],
            { session }
        );

        await Profile.create(
            [
                {
                    user: createdUser[0]._id,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        const { password, ...rest } = createdUser[0].toObject();
        return rest;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const UserService = {
    register,
};
