import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createTokens } from "../../utils/userTokens";

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

export const AuthService = {
    login,
};
