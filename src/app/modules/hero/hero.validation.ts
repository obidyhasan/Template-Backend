import { z } from "zod";

export const createHeroImageZodSchema = z.object({
  image: z.string().optional(),
});

export const updateHeroImageZodSchema = z.object({
  image: z.string().optional().nullable(),
});

