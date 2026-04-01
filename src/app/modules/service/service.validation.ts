import { z } from "zod";

export const createServiceZodSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().min(0),
  category: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string().min(1)).optional(),
});

export const updateServiceZodSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  features: z.array(z.string().min(1)).optional(),
});

