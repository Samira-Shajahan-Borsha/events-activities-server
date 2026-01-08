import { Types } from "mongoose";

export enum EVENT_STATUS {
    OPEN = "OPEN",
    FULL = "FULL",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

export enum IS_PAID {
    PAID = "PAID",
    FREE = "FREE",
}

export interface IEvent {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    type: string;
    description: string;
    image: string;
    date: Date;
    location: string;
    minParticipants?: number;
    maxParticipants?: number;
    isPaid: IS_PAID;
    joiningFee: number;
    status: EVENT_STATUS;
    isFeatured: boolean;
    host: Types.ObjectId;
}
