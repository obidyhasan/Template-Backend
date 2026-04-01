import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";

const createFaq = async (payload: Prisma.FaqCreateInput) => {
  return prisma.faq.create({ data: payload });
};

const getAllFaqs = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const where: Prisma.FaqWhereInput = {
    ...(params.q
      ? {
          OR: [
            { trigger: { contains: String(params.q), mode: "insensitive" } },
            { content: { contains: String(params.q), mode: "insensitive" } },
            { value: { contains: String(params.q), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const data = await prisma.faq.findMany({
    skip,
    take: limit,
    where,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.faq.count({ where });
  return { meta: { page, limit, total }, data };
};

const getSingleFaq = async (id: string) => {
  return prisma.faq.findUniqueOrThrow({ where: { id } });
};

const updateFaq = async (id: string, payload: Prisma.FaqUpdateInput) => {
  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "FAQ not found!");
  return prisma.faq.update({ where: { id }, data: payload });
};

const deleteFaq = async (id: string) => {
  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "FAQ not found!");
  return prisma.faq.delete({ where: { id } });
};

export const FaqService = {
  createFaq,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
};

