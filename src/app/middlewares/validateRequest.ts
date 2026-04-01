import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

type AnyZodObject = ZodObject<ZodRawShape>;

const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
