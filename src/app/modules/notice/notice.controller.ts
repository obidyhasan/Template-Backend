import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { NoticeService } from "./notice.service";

const createNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.createNotice(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notice created successfully!",
    data: result,
  });
});

const getAllNotices = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await NoticeService.getAllNotices({}, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notices retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getSingleNotice(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice retrieved successfully!",
    data: result,
  });
});

const updateNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.updateNotice(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice updated successfully!",
    data: result,
  });
});

const deleteNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.deleteNotice(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice deleted successfully!",
    data: result,
  });
});

export const NoticeController = {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
};

