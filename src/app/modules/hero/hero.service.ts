import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
const createHeroImage = async (payload: Prisma.HeroImageCreateInput) => {
  return prisma.heroImage.create({ data: payload });
};

const getAllHeroImages = async (_params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const data = await prisma.heroImage.findMany({
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.heroImage.count();
  return { meta: { page, limit, total }, data };
};

const getSingleHeroImage = async (id: string) => {
  return prisma.heroImage.findUniqueOrThrow({ where: { id } });
};

const updateHeroImage = async (id: string, payload: Prisma.HeroImageUpdateInput) => {
  const existing = await prisma.heroImage.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Hero image not found!");

  if (payload.image && existing.image && payload.image !== existing.image) {
    await deleteImageFromCloudinary(existing.image as string);
  }

  return prisma.heroImage.update({ where: { id }, data: payload });
};

const deleteHeroImage = async (id: string) => {
  const existing = await prisma.heroImage.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Hero image not found!");

  if (existing.image) {
    await deleteImageFromCloudinary(existing.image as string);
  }

  return prisma.heroImage.delete({ where: { id } });
};

export const HeroService = {
  createHeroImage,
  getAllHeroImages,
  getSingleHeroImage,
  updateHeroImage,
  deleteHeroImage,
};

