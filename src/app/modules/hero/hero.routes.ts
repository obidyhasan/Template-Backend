import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { HeroController } from "./hero.controller";
import { createHeroImageZodSchema, updateHeroImageZodSchema } from "./hero.validation";

const router = Router();

router.get("/", HeroController.getAllHeroImages);
router.get("/:id", HeroController.getSingleHeroImage);

router.post("/", auth(Role.ADMIN), validateRequest(createHeroImageZodSchema), HeroController.createHeroImage);
router.patch("/:id", auth(Role.ADMIN), validateRequest(updateHeroImageZodSchema), HeroController.updateHeroImage);
router.delete("/:id", auth(Role.ADMIN), HeroController.deleteHeroImage);

export const HeroRoutes = router;

