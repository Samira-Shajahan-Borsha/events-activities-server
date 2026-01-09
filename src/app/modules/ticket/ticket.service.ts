import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { EVENT_STATUS, IS_PAID } from "../event/event.interface";
import { Event } from "../event/event.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.mode";
import { TICKET_STATUS } from "./ticket.interface";
import { Ticket } from "./ticket.model";

export const createTicket = async (eventId: string, userId: string) => {
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
            user: userId,
            event: isExistEvent?._id,
            status: { $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED] },
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
                        user: userId,
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
                    user: userId,
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
                    user: userId,
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
        );


        await session.commitTransaction();
        session.endSession();

        return {
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

export const TicketService = {
    createTicket,
    leaveEvent,
};
