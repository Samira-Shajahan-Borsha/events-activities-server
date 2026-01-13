import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { IEvent, IS_PAID } from "./event.interface";
import { Event } from "./event.model";
import { User } from "../user/user.model";
import { ROLE, STATUS } from "../user/user.interface";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { eventSearchableFields } from "./event.constant";

const createEvent = async (payload: Partial<IEvent>) => {
    const user = await User.findById(payload.host);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }
    if (user.status !== STATUS.ACTIVE) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "User account is not active. Cannot create events."
        );
    }

    if (!payload.joiningFee || payload.joiningFee === 0) {
        payload.isPaid = IS_PAID.FREE;
        payload.joiningFee = 0;
    } else {
        payload.isPaid = IS_PAID.PAID;
        if ((payload.joiningFee as number) <= 0) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Joining fee must be greater than 0 for paid events."
            );
        }
    }

    const event = await Event.create(payload);
    return event;
};

const getAllEvents = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Event.find(), query);

    const tours = await queryBuilder
        .search(eventSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([tours.build(), queryBuilder.getMeta()]);

    return {
        data,
        meta,
    };
};

const getMyEvents = async (query: Record<string, string>, userId: string) => {
    const queryBuilder = new QueryBuilder(
        Event.find({
            host: userId,
        }),
        query
    );

    const tours = await queryBuilder
        .search(eventSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([tours.build(), queryBuilder.getMeta()]);

    return {
        data,
        meta,
    };
};

const updateEvent = async (id: string, payload: Partial<IEvent>, decodedToken: JwtPayload) => {
    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
        throw new Error("Event not found.");
    }

    if (decodedToken.role === ROLE.HOST && existingEvent.host.toString() !== decodedToken.userId) {
        throw new Error("Hosts can only update their own events.");
    }

    if (decodedToken.role === ROLE.HOST) {
        delete payload.isFeatured;
    }

    if (payload.joiningFee === 0) {
        payload.isPaid = IS_PAID.FREE;
        payload.joiningFee = 0;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    // Delete image from cloudinary if changed
    if (payload.image && existingEvent.image && payload.image !== existingEvent.image) {
        await deleteImageFromCloudinary(existingEvent.image);
    }

    return updatedEvent;
};

const getSingleEvent = async (slug: string) => {
    const event = await Event.findOne({ slug });

    if (!event) {
        throw new AppError(httpStatus.NOT_FOUND, "Event not found");
    }

    return event;
};

const deleteEvent = async (decodedToken: JwtPayload, eventId: string) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw new AppError(httpStatus.NOT_FOUND, "Event not found");
    }

    if (decodedToken.role === ROLE.HOST && event.host.toString() !== decodedToken.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "Hosts can only delete their own events");
    }

    await Event.findByIdAndDelete(eventId);

    if (event.image) {
        await deleteImageFromCloudinary(event.image);
    }

    return null;
};

export const EventService = {
    createEvent,
    getAllEvents,
    getMyEvents,
    updateEvent,
    getSingleEvent,
    // getEventById,
    deleteEvent,
};
