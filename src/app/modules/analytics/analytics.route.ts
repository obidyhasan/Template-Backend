import express from "express";
import { AnalyticsController } from "./analytics.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", auth(Role.ADMIN), AnalyticsController.getAnalytics);

export const AnalyticsRoutes = router;
