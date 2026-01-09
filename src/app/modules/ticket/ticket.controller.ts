import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TicketService } from "./ticket.service";

const createTicket = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.body;
    const decodedToken = req.user;

    const result = await TicketService.createTicket(eventId, decodedToken.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Created ticket successfully",
        data: result,
    });
});

export const leaveEvent = catchAsync(async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    const decodedToken = req.user;

    const result = await TicketService.leaveEvent(ticketId, decodedToken.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Ticket status updated successfully",
        data: result,
    });
});

const getMyTickets = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const decodedToken = req.user;

    const result = await TicketService.getMyTickets(
        query as Record<string, string>,
        decodedToken.userId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My tickets retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

export const TicketController = {
    createTicket,
    leaveEvent,
    getMyTickets,
};
