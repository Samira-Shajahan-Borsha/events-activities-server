import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { Profile } from "../profile/profile.model";

const login = async (payload: Partial<IUser>) => {
    const { email, password: plainPassword } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    const isPasswordMatch = await bcrypt.compare(
        plainPassword as string,
        isUserExist.password as string
    );

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
    }

    const tokens = createTokens(isUserExist);

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        data: { email },
    };
};

const getAccessToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN_SECRET);

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
    }

    if (isUserExist.isDeleted) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "User account is deleted. Please contact with support"
        );
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_TOKEN_SECRET,
        envVars.JWT_ACCESS_TOKEN_EXPIRES
    );

    return {
        accessToken,
    };
};

const getMe = async (userId: string) => {
    // const user = await User.findById(userId).select("-password");
    const user = await Profile.findOne({ user: userId }).populate("user", "email role status");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    return user;
};

export const AuthService = {
    login,
    getAccessToken,
    getMe,
};
