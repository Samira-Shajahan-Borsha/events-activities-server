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
        fullName: { type: String, required: [true, "Name is required"], trim: true, minLength: 2 },
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
            default: ROLE.USER,
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

userSchema.virtual("profile", {
    ref: "Profile",
    localField: "_id",
    foreignField: "user",
    justOne: true,
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export const User = model<IUser>("User", userSchema);
