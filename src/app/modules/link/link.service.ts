import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
const createLink = async (payload: Prisma.LinkCreateInput) => {
  return prisma.link.create({ data: payload });
};

const getAllLinks = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const where: Prisma.LinkWhereInput = {
    ...(params.q
      ? {
          OR: [
            { title: { contains: String(params.q), mode: "insensitive" } },
            { description: { contains: String(params.q), mode: "insensitive" } },
            { link: { contains: String(params.q), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const data = await prisma.link.findMany({
    skip,
    take: limit,
    where,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.link.count({ where });
  return { meta: { page, limit, total }, data };
};

const getSingleLink = async (id: number) => {
  return prisma.link.findUniqueOrThrow({ where: { id } });
};

const updateLink = async (id: number, payload: Prisma.LinkUpdateInput) => {
  const existing = await prisma.link.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Link not found!");

  if (payload.image && existing.image && payload.image !== existing.image) {
    await deleteImageFromCloudinary(existing.image as string);
  }

  return prisma.link.update({ where: { id }, data: payload });
};

const deleteLink = async (id: number) => {
  const existing = await prisma.link.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Link not found!");

  if (existing.image) {
    await deleteImageFromCloudinary(existing.image as string);
  }

  return prisma.link.delete({ where: { id } });
};

export const LinkService = {
  createLink,
  getAllLinks,
  getSingleLink,
  updateLink,
  deleteLink,
};

