import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";
import { UploadController } from "./upload.controller";

const router = Router();

router.post(
  "/image",
  auth(Role.ADMIN),
  multerUpload.single("file"),
  UploadController.uploadSingleImage,
);

router.post(
  "/images",
  auth(Role.ADMIN),
  multerUpload.array("files", 10),
  UploadController.uploadMultipleImages,
);

export const UploadRoutes = router;

