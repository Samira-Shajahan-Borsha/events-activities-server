import { model, Schema } from "mongoose";
import { IAuthProvider, STATUS, IUser, ROLE } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
    {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
    },
    {
        timestamps: false,
        versionKey: false,
        _id: false,
    }
);

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: [true, "Email is required"], trim: true, unique: true },
        password: {
            type: String,
            minlength: [8, "Password must contain 8 characters long"],
            trim: true,
        },
        role: {
            type: String,
            enum: {
                values: Object.values(ROLE),
                message: "{VALUE} is not supported as role",
            },
            default: ROLE.PARTICIPANT,
        },
        status: {
            type: String,
            enum: {
                values: Object.values(STATUS),
                message: "{VALUE} is not supported as user status",
            },
            default: STATUS.ACTIVE,
        },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        auths: [authProviderSchema],
    },
    { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
