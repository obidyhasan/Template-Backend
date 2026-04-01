import { z } from "zod";

export const createLinkZodSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  link: z.string().url(),
});

export const updateLinkZodSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().optional().nullable(),
  link: z.string().url().optional(),
});

