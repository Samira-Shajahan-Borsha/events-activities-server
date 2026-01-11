import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status-codes";

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.register(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await UserService.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All users retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getAllHosts = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await UserService.getAllHosts(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All hosts retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await UserService.getUserProfile(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile info retrieved successfully",
        data: result,
    });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result = await UserService.blockUser(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User blocked successfully",
        data: result,
    });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result = await UserService.unblockUser(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User unblocked successfully",
        data: result,
    });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result = await UserService.updateRole(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User role updated successfully",
        data: result,
    });
});

export const UserController = {
    register,
    getAllUsers,
    getAllHosts,
    getUserProfile,
    blockUser,
    unblockUser,
    updateRole
};
