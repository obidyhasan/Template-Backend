import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
const createNotice = async (payload: Prisma.NoticeCreateInput) => {
  return prisma.notice.create({ data: payload });
};

const getAllNotices = async (_params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const data = await prisma.notice.findMany({
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.notice.count();
  return { meta: { page, limit, total }, data };
};

const getSingleNotice = async (id: string) => {
  return prisma.notice.findUniqueOrThrow({ where: { id } });
};

const updateNotice = async (id: string, payload: Prisma.NoticeUpdateInput) => {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Notice not found!");

  if (payload.image && existing.image && payload.image !== existing.image) {
    await deleteImageFromCloudinary(existing.image as string);
  }

  return prisma.notice.update({ where: { id }, data: payload });
};

const deleteNotice = async (id: string) => {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Notice not found!");

  if (existing.image) {
    await deleteImageFromCloudinary(existing.image as string);
  }

  return prisma.notice.delete({ where: { id } });
};

export const NoticeService = {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
};

