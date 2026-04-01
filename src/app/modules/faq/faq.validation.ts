import { z } from "zod";

export const createFaqZodSchema = z.object({
  value: z.string().min(1),
  trigger: z.string().min(1),
  content: z.string().min(1),
});

export const updateFaqZodSchema = z.object({
  value: z.string().min(1).optional(),
  trigger: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

