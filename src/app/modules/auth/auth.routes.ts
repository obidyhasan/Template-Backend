import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { bootstrapAdminZodSchema, loginZodSchema } from "./auth.validation";

const router = Router();

router.post("/bootstrap-admin", validateRequest(bootstrapAdminZodSchema), AuthController.bootstrapAdmin);
router.post("/login", validateRequest(loginZodSchema), AuthController.login);
router.get("/me", auth(Role.ADMIN, Role.USER), AuthController.me);

export const AuthRouter = router;

