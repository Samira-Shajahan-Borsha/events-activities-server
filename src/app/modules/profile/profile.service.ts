import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { EVENT_STATUS, IEvent } from "../event/event.interface";
import { Event } from "../event/event.model";
import { ITicket, TICKET_STATUS } from "../ticket/ticket.interface";
import { Ticket } from "../ticket/ticket.model";
import { ROLE } from "../user/user.interface";
import { User } from "../user/user.model";
import { IProfile } from "./profile.interface";
import { Profile } from "./profile.model";
import httpStatus from "http-status-codes";

export const updateProfile = async (userId: string, payload: Partial<IProfile>) => {
    const existingProfile = await Profile.findOne({ user: userId });

    if (!existingProfile) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }

    if (!payload.profilePhoto) {
        payload.profilePhoto = existingProfile.profilePhoto;
    } else {
        // Delete old image from Cloudinary if new one is uploaded
        if (existingProfile.profilePhoto) {
            await deleteImageFromCloudinary(existingProfile.profilePhoto);
        }
    }

    const updatedProfile = await Profile.findOneAndUpdate({ user: userId }, payload, {
        new: true,
        runValidators: true,
    });

    return updatedProfile;
};

const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    const profile = await Profile.findOne({ user: user._id }).populate(
        "user",
        "fullName email role status"
    );

    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }

    let hostedEvents: IEvent[] = [];

    if (user.role === ROLE.HOST || user.role === ROLE.ADMIN) {
        hostedEvents = await Event.find({
            host: user._id,
            status: { $ne: EVENT_STATUS.CANCELLED },
        })
            .select("name slug type image date location isPaid joiningFee status isFeatured maxParticipants")
            .sort({ date: -1 })
            .limit(10);
    }

    const tickets = await Ticket.find({
        user: user._id,
        status: TICKET_STATUS.CONFIRMED,
    })
        .populate({
            path: "event",
            select: "name slug type image date location isPaid joiningFee status isFeatured host maxParticipants",
        })
        .sort({ createdAt: -1 })
        .limit(10);

    const joinedEvents = tickets.map((ticket: ITicket) => ticket.event).filter(Boolean);

    return {
        profile,
        hostedEvents,
        joinedEvents,
    };
};

export const ProfileService = {
    updateProfile,
    getUserProfile,
};
