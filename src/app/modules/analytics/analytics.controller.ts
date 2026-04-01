import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AnalyticsService } from "./analytics.service";
import httpStatus from "http-status";

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getAnalytics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Analytics fetched successfully",
    data: result,
  });
});

export const AnalyticsController = {
  getAnalytics,
};
