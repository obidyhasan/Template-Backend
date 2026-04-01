import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { LinkController } from "./link.controller";
import { createLinkZodSchema, updateLinkZodSchema } from "./link.validation";

const router = Router();

router.get("/", LinkController.getAllLinks);
router.get("/:id", LinkController.getSingleLink);

router.post("/", auth(Role.ADMIN), validateRequest(createLinkZodSchema), LinkController.createLink);
router.patch("/:id", auth(Role.ADMIN), validateRequest(updateLinkZodSchema), LinkController.updateLink);
router.delete("/:id", auth(Role.ADMIN), LinkController.deleteLink);

export const LinkRoutes = router;

