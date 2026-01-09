import { Schema, model } from "mongoose";
import { ITicket, TICKET_STATUS } from "./ticket.interface";

const ticketSchema = new Schema<ITicket>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: {
                values: Object.values(TICKET_STATUS),
                message: "{VALUE} is not supported as ticket status",
            },
            default: TICKET_STATUS.PENDING,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);
