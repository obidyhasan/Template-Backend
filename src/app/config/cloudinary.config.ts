/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

import { Stream } from "stream";
import config from ".";
import ApiError from "../errors/ApiError";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;

      const bufferStream = new Stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.log(error);
    throw new ApiError(401, `Error uploading file ${error.message}`);
  }
};

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return;
    
    let pathAfterUpload = parts[1];
    
    // Remove versioning (e.g., v1234567890/)
    if (pathAfterUpload.match(/^v\d+\//)) {
      pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    }
    
    // Remove extension
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    let public_id = lastDotIndex !== -1 ? pathAfterUpload.substring(0, lastDotIndex) : pathAfterUpload;
    
    // Decode URI components (e.g., %20 to space) since Cloudinary expects the unencoded public_id
    public_id = decodeURIComponent(public_id);
    
    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new ApiError(401, "Cloudinary image deletion failed", error.message);
  }
};

export const cloudinaryUpload = cloudinary;
