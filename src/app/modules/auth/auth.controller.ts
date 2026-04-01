import httpStatus from "http-status";
import { Request, Response } from "express";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const bootstrapAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.bootstrapAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    data: result,
  });
});

const me = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await AuthService.me(req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Me retrieved successfully!",
    data: result,
  });
});

export const AuthController = {
  bootstrapAdmin,
  login,
  me,
};

