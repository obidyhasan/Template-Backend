import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceController } from "./service.controller";
import { createServiceZodSchema, updateServiceZodSchema } from "./service.validation";

const router = Router();

router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getSingleService);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(createServiceZodSchema),
  ServiceController.createService,
);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(updateServiceZodSchema),
  ServiceController.updateService,
);
router.delete("/:id", auth(Role.ADMIN), ServiceController.deleteService);

export const ServiceRoutes = router;

