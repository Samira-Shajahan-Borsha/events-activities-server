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

export const EventController = {
    createEvent,
    updateEvent,
};
