import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { EVENT_STATUS, IS_PAID } from "../event/event.interface";
import { Event } from "../event/event.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { TICKET_STATUS } from "./ticket.interface";
import { Ticket } from "./ticket.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

export const createTicket = async (eventId: string, user: JwtPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const isExistEvent = await Event.findById(eventId);

        if (!isExistEvent) {
            throw new AppError(httpStatus.NOT_FOUND, "Event not found");
        }

        const now = new Date();

        const event = await Event.findOne({
            _id: isExistEvent?._id,
            status: EVENT_STATUS.OPEN,
            date: { $gt: now },
        }).session(session);

        if (!event) {
            throw new AppError(httpStatus.BAD_REQUEST, "Event is not available for joining");
        }

        const existingTicket = await Ticket.findOne({
            user: user.userId,
            event: isExistEvent?._id,
            status: { $in: [TICKET_STATUS.CONFIRMED] },
        }).session(session);

        if (existingTicket) {
            throw new AppError(httpStatus.BAD_REQUEST, "You already joined this event");
        }

        if (event.maxParticipants) {
            const confirmedCount = await Ticket.countDocuments({
                event: isExistEvent?._id,
                status: TICKET_STATUS.CONFIRMED,
            }).session(session);

            if (confirmedCount >= event.maxParticipants) {
                throw new AppError(httpStatus.BAD_REQUEST, "Event is full");
            }
        }

        /*  FREE EVENT  */
        if (event.isPaid === IS_PAID.FREE) {
            const ticket = await Ticket.create(
                [
                    {
                        user: user.userId,
                        event: isExistEvent?._id,
                        status: TICKET_STATUS.CONFIRMED,
                    },
                ],
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return {
                paymentUrl: null,
                ticket: ticket[0],
            };
        }

        /* PAID EVENT */
        const transactionId = getTransactionId();

        /* Create Ticket (PENDING) */
        const ticket = await Ticket.create(
            [
                {
                    user: user.userId,
                    event: isExistEvent?._id,
                    status: TICKET_STATUS.PENDING,
                },
            ],
            { session }
        );

        /*  Create Payment */
        const payment = await Payment.create(
            [
                {
                    ticket: ticket[0]._id,
                    user: user.userId,
                    event: isExistEvent?._id,
                    transactionId,
                    amount: event.joiningFee,
                    status: PAYMENT_STATUS.UNPAID,
                },
            ],
            { session }
        );

        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticket[0]._id,
            { payment: payment[0]._id },
            { new: true, runValidators: true, session }
        )
            .populate("user", "name email role")
            .populate("event", "name type description isPaid status joiningFee")
            .populate("payment");

        /* Init Payment Gateway */
        const sslPayload: ISSLCommerz = {
            amount: event.joiningFee,
            transactionId,
            name: `Event - ${isExistEvent.name}`,
            email: user.email,
            phoneNumber: "01XXXXXXXXX",
            address: "N/A",
        };

        const sslPayment = await SSLService.sslPaymentInit(sslPayload);

        await session.commitTransaction();
        session.endSession();

        return {
            paymentUrl: sslPayment.GatewayPageURL, // frontend will hit this payment url
            ticket: updatedTicket,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const leaveEvent = async (ticketId: string, userId: string) => {
    const isExistTicket = await Ticket.findById(ticketId);

    if (!isExistTicket) {
        throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
    }

    const updatedTicket = await Ticket.findOneAndUpdate(
        {
            _id: ticketId,
            user: userId,
            status: { $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED] },
        },
        { status: TICKET_STATUS.CANCELED },
        { new: true }
    );

    if (!updatedTicket) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ticket is already canceled");
    }

    return updatedTicket;
};

const getMyTickets = async (query: Record<string, string>, userId: string) => {
    const queryBuilder = new QueryBuilder(
        Ticket.find({ user: userId }).populate({
            path: "event",
            select: "name type description date location joiningFee isPaid host status",
            populate: {
                path: "host",
                select: "fullName email",
            },
        }),
        query
    );
    const tours = await queryBuilder.search([]).filter().sort().fields().paginate();

    const [data, meta] = await Promise.all([tours.build(), queryBuilder.getMeta()]);

    return {
        data,
        meta,
    };
};

const getTicket = async (transactionId: string, userId: string) => {
    const existingPayment = await Payment.findOne({ transactionId: transactionId });

    if (!existingPayment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    if (existingPayment.user.toString() !== userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to access this ticket");
    }

    const payment = await Payment.findOne({ transactionId })
        .select("ticket user event transactionId amount status createdAt invoiceUrl")
        .populate({
            path: "event",
            select: "name type description date location joiningFee isPaid status host",
            populate: {
                path: "host",
                select: "fullName email",
            },
        })
        .exec();

    return payment;
};

export const TicketService = {
    createTicket,
    leaveEvent,
    getMyTickets,
    getTicket,
};
