import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { HeroService } from "./hero.service";

const createHeroImage = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.createHeroImage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Hero image created successfully!",
    data: result,
  });
});

const getAllHeroImages = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await HeroService.getAllHeroImages({}, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hero images retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleHeroImage = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.getSingleHeroImage(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hero image retrieved successfully!",
    data: result,
  });
});

const updateHeroImage = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.updateHeroImage(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hero image updated successfully!",
    data: result,
  });
});

const deleteHeroImage = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.deleteHeroImage(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hero image deleted successfully!",
    data: result,
  });
});

export const HeroController = {
  createHeroImage,
  getAllHeroImages,
  getSingleHeroImage,
  updateHeroImage,
  deleteHeroImage,
};

