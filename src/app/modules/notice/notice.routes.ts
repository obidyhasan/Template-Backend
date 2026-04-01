import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { NoticeController } from "./notice.controller";
import { createNoticeZodSchema, updateNoticeZodSchema } from "./notice.validation";

const router = Router();

router.get("/", NoticeController.getAllNotices);
router.get("/:id", NoticeController.getSingleNotice);

router.post("/", auth(Role.ADMIN), validateRequest(createNoticeZodSchema), NoticeController.createNotice);
router.patch("/:id", auth(Role.ADMIN), validateRequest(updateNoticeZodSchema), NoticeController.updateNotice);
router.delete("/:id", auth(Role.ADMIN), NoticeController.deleteNotice);

export const NoticeRoutes = router;

