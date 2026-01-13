import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, ROLE, STATUS } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Profile } from "../profile/profile.model";
import mongoose from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";

const register = async (payload: Partial<IUser>) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { fullName, email, password: plainPassword } = payload;

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
                    fullName,
                    email,
                    password: hashedPassword,
                    auths: [authProvider],
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = createdUser[0].toObject();
        return rest;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        User.find({ role: ROLE.USER }).populate({
            path: "profile",
        }),
        query
    );

    const users = queryBuilder.search(userSearchableFields).filter().sort().fields().paginate();

    const [data, meta] = await Promise.all([users.build(), queryBuilder.getMeta()]);

    const userData = data?.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, auths, ...usersWithoutPassword } = user.toObject();
        return usersWithoutPassword;
    });

    return {
        data: userData,
        meta: meta,
    };
};

const getAllHosts = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        User.find({ role: ROLE.HOST }).populate({
            path: "profile"
        }),
        query
    );

    const users = queryBuilder.search(userSearchableFields).filter().sort().fields().paginate();

    const [data, meta] = await Promise.all([users.build(), queryBuilder.getMeta()]);

    const userData = data?.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, auths, ...usersWithoutPassword } = user.toObject();
        return usersWithoutPassword;
    });

    return {
        data: userData,
        meta: meta,
    };
};

const getUserProfile = async (userId: string) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    const user = await Profile.findOne({ user: isUserExist._id }).populate(
        "user",
        "email role status"
    );

    return user;
};

const blockUser = async (userId: string) => {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (existingUser.status === STATUS.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User account is already blocked");
    }

    const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
            status: STATUS.BLOCKED,
        },
        { new: true, runValidators: true }
    ).select("-password");

    return updatedUser;
};

const unblockUser = async (userId: string) => {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (existingUser.status === STATUS.ACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "User account is already active");
    }

    const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
            status: STATUS.ACTIVE,
        },
        { new: true, runValidators: true }
    ).select("-password");

    return updatedUser;
};

const updateRole = async (userId: string) => {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (existingUser.role !== ROLE.USER) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Only users with role USER can be upgraded to HOST"
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
            role: ROLE.HOST,
        },
        { new: true, runValidators: true }
    ).select("-password");

    return updatedUser;
};

export const UserService = {
    register,
    getAllUsers,
    getAllHosts,
    getUserProfile,
    blockUser,
    unblockUser,
    updateRole,
};
