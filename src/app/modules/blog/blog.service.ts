import { Blog, Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { paginationHelper, IOptions } from "../../helper/paginationHelper";
import { IBlogFilterRequest } from "./blog.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createBlog = async (data: Prisma.BlogCreateInput): Promise<Blog> => {
  const result = await prisma.blog.create({
    data,
  });
  return result;
};

const getAllBlogs = async (
  filters: IBlogFilterRequest,
  options: IOptions,
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

if (searchTerm) {
  andConditions.push({
    OR: [
      {
        title: {
          contains: searchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        content: {
          contains: searchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ],
  });
}

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleBlog = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBlog = async (
  id: string,
  payload: Partial<Blog>,
): Promise<Blog> => {
  const isExist = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (payload.image && isExist.image && payload.image !== isExist.image) {
    await deleteImageFromCloudinary(isExist.image);
  }

  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBlog = async (id: string): Promise<Blog> => {
  const isExist = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  if (isExist.image) {
    await deleteImageFromCloudinary(isExist.image);
  }

  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
