import { z } from "zod";

export const bootstrapAdminZodSchema = z.object({
  secret: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

