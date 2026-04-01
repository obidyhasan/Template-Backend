import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";

const createService = async (payload: Prisma.ServiceCreateInput) => {
  return prisma.service.create({
    data: {
      name: payload.name,
      price: payload.price,
      category: payload.category,
      description: payload.description,
      features: payload.features ?? [],
    },
  });
};

const getAllServices = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const where: Prisma.ServiceWhereInput = {
    ...(params.category ? { category: { equals: String(params.category) } } : {}),
    ...(params.q
      ? {
          OR: [
            { name: { contains: String(params.q), mode: "insensitive" } },
            { category: { contains: String(params.q), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const data = await prisma.service.findMany({
    skip,
    take: limit,
    where,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.service.count({ where });
  return { meta: { page, limit, total }, data };
};

const getSingleService = async (id: string) => {
  return prisma.service.findUniqueOrThrow({ where: { id } });
};

const updateService = async (id: string, payload: Prisma.ServiceUpdateInput) => {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Service not found!");

  return prisma.service.update({ where: { id }, data: payload });
};

const deleteService = async (id: string) => {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Service not found!");

  return prisma.service.delete({ where: { id } });
};

export const ServiceService = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};

