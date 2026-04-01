import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { LinkService } from "./link.service";

const createLink = catchAsync(async (req: Request, res: Response) => {
  const result = await LinkService.createLink(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Link created successfully!",
    data: result,
  });
});

const getAllLinks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["q"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await LinkService.getAllLinks(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Links retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleLink = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await LinkService.getSingleLink(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Link retrieved successfully!",
    data: result,
  });
});

const updateLink = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await LinkService.updateLink(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Link updated successfully!",
    data: result,
  });
});

const deleteLink = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await LinkService.deleteLink(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Link deleted successfully!",
    data: result,
  });
});

export const LinkController = {
  createLink,
  getAllLinks,
  getSingleLink,
  updateLink,
  deleteLink,
};

