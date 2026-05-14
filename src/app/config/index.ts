import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_number: process.env.BCRYPT_SALT_NUMBER,
  admin_bootstrap_secret: process.env.ADMIN_BOOTSTRAP_SECRET,
  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires: process.env.JWT_ACCESS_EXPIRES,
  },
  cloudinary: {
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  },
  redis: {
    enabled:
      process.env.REDIS_ENABLED === "true"
        ? true
        : process.env.NODE_ENV !== "development",
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT) as number,
    password: process.env.REDIS_PASSWORD as string,
    username: process.env.REDIS_USERNAME as string,
  },
  bkash: {
    base_url: process.env.BKASH_BASE_URL as string,
    username: process.env.BKASH_USERNAME as string,
    password: process.env.BKASH_PASSWORD as string,
    api_key: process.env.BKASH_API_KEY as string,
    api_secret: process.env.BKASH_API_SECRET as string,
  },
};
