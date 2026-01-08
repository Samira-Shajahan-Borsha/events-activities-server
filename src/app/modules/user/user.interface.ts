import { Types } from "mongoose";

export enum ROLE {
    ADMIN = "ADMIN",
    PARTICIPANT = "PARTICIPANT",
    HOST = "HOST",
}

export enum STATUS {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
    provider: "credentials" | "google";
    providerId: string;
}

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    role: ROLE;
    status: STATUS;
    isVerified?: boolean;
    isDeleted?: boolean;
    auths: IAuthProvider[];
}
