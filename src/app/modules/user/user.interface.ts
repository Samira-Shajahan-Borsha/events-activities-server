import { Types } from "mongoose";

export enum ROLE {
    ADMIN = "ADMIN",
    USER = "USER",
    HOST = "HOST",
}

export enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
    provider: "credentials" | "google";
    providerId: string;
}

export interface IUser {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    role: ROLE;
    status: STATUS;
    isVerified?: boolean;
    isDeleted?: boolean;
    auths: IAuthProvider[];
}
