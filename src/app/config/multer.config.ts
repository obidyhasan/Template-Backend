/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const parts = file.originalname.split(".");
      const extension = parts.pop();
      const nameWithoutExtension = parts.join(".");
      const sanitizedName = nameWithoutExtension
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        sanitizedName;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
