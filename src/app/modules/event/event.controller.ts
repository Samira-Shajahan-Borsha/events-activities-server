import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { EventService } from "./event.service";
import { IEvent } from "./event.interface";

const createEvent = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;

    const payload: Partial<IEvent> = {
        ...req.body,
        host: decodedToken.userId,
        image: req.file?.path,
    };

    const result = await EventService.createEvent(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Event created successfully",
        data: result,
    });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await EventService.getAllEvents(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const decodedToken = req.user;

    const result = await EventService.getMyEvents(
        query as Record<string, string>,
        decodedToken.userId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const decodedToken = req.user;

    const payload: Partial<IEvent> = {
        ...req.body,
        image: req.file?.path,
    };

    const result = await EventService.updateEvent(id, payload, decodedToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event updated successfully",
        data: result,
    });
});

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const result = await EventService.getSingleEvent(slug);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event retrieved successfully",
        data: result,
    });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const decodedToken = req.user;

    const result = await EventService.deleteEvent(decodedToken, eventId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event deleted successfully",
        data: result,
    });
});

export const EventController = {
    createEvent,
    getAllEvents,
    getMyEvents,
    updateEvent,
    getSingleEvent,
    deleteEvent,
};
