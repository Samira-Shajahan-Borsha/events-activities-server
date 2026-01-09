/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import mongoose from "mongoose";
import { Ticket } from "../ticket/ticket.model";
import { TICKET_STATUS } from "../ticket/ticket.interface";
import httpStatus from "http-status-codes";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { IUser } from "../user/user.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const initPayment = async (ticketId: string) => {
    const payment = await Payment.findOne({ ticket: ticketId });

    if (!payment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Payment not found. You have not bought this ticket."
        );
    }

    const ticket = await Ticket.findById(payment.ticket).populate("user");

    const userData = ticket?.user as unknown as IUser;

    const sslPayload: ISSLCommerz = {
        address: "N/A",
        email: userData?.email || "N/A",
        phoneNumber: "00000000000",
        name: userData?.fullName || "Guest User",
        amount: payment.amount,
        transactionId: payment.transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
};

const successPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PAYMENT_STATUS.PAID,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(400, "Payment not updated");
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            updatedPayment?.ticket,
            {
                status: TICKET_STATUS.CONFIRMED,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedTicket) {
            throw new AppError(400, "Payment not updated");
        }

        await session.commitTransaction();

        session.endSession();

        return { success: true, message: "Payment completed successfully" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const failPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PAYMENT_STATUS.FAILED,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(400, "Payment not updated");
        }

        await Ticket.findByIdAndUpdate(
            updatedPayment?.ticket,
            {
                status: TICKET_STATUS.FAILED,
            },
            { new: true, runValidators: true, session }
        );

        await session.commitTransaction();

        session.endSession();

        return { success: false, message: "Payment failed" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PAYMENT_STATUS.CANCELED,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(400, "Payment not updated");
        }

        await Ticket.findByIdAndUpdate(
            updatedPayment?.ticket,
            {
                status: TICKET_STATUS.CANCELED,
            },
            { new: true, runValidators: true, session }
        );

        await session.commitTransaction();

        session.endSession();

        return { success: false, message: "Payment canceled" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};
