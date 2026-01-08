import { model, Schema } from "mongoose";
import { IProfile } from "./profile.interface";

const profileSchema = new Schema<IProfile>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        location: {
            type: String,
            default: "",
        },
        profilePhoto: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
            maxLength: 500,
        },
        interests: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Profile = model<IProfile>("Profile", profileSchema);
