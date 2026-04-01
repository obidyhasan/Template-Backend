import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const uploadSingleImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "No file received",
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upload successful!",
    data: {
      url: (file as any).path ?? (file as any).secure_url,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
});

const uploadMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const list = Array.isArray(files) ? files : [];

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upload successful!",
    data: list.map((file) => ({
      url: (file as any).path ?? (file as any).secure_url,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    })),
  });
});

export const UploadController = {
  uploadSingleImage,
  uploadMultipleImages,
};

