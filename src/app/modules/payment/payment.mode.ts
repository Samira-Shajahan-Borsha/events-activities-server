import { Schema, model } from "mongoose";
import { PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema(
    {
        ticket: {
            type: Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.UNPAID,
        },
        paymentGatewayData: {
            type: Schema.Types.Mixed,
        },
        invoiceUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Payment = model("Payment", paymentSchema);
