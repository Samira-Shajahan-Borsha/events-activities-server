import { Types } from "mongoose";

export enum TICKET_STATUS {
    PENDING = "PENDING", // Joined but payment not completed
    CONFIRMED = "CONFIRMED", // Successfully joined
    CANCELED = "CANCELED", // User left / host removed
    FAILED = "FAILED", // Payment failed
}

export interface ITicket {
    user: Types.ObjectId;
    event: Types.ObjectId;
    status: TICKET_STATUS;
    payment: Types.ObjectId | null;
    createdAt?: Date;
    updatedAt?: Date;
}
