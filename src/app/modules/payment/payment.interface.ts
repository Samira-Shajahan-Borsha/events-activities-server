/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    FAILED = "FAILED",
    CANCELED = "CANCELED",
    REFUNDED = "REFUNDED",
}

export interface IPayment {
    ticket: Types.ObjectId;
    user: Types.ObjectId;
    event: Types.ObjectId;
    transactionId: string;
    amount: number;
    status: PAYMENT_STATUS;
    paymentGatewayData?: any;
    invoiceUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
