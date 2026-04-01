import { z } from "zod";

export const createNoticeZodSchema = z.object({
  image: z.string().optional(),
});

export const updateNoticeZodSchema = z.object({
  image: z.string().optional().nullable(),
});

