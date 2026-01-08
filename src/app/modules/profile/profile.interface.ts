import { Types } from "mongoose";

export interface IProfile {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    fullName?: string | null;
    location?: string;
    profilePhoto?: string;
    bio?: string;
    interests?: string[];
}
