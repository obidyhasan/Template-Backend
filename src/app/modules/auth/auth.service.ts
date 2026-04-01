import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import config from "../../config";
import { jwtHelper } from "../../helper/jwtHelper";
import { prisma } from "../../shared/prisma";

const bootstrapAdmin = async (payload: {
  secret: string;
  email: string;
  password: string;
}) => {
  if (!config.admin_bootstrap_secret) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "ADMIN_BOOTSTRAP_SECRET is not configured",
    );
  }
  if (payload.secret !== config.admin_bootstrap_secret) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid bootstrap secret");
  }

  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  });
  if (existingAdmin) {
    throw new ApiError(httpStatus.CONFLICT, "Admin already exists");
  }

  const saltRounds = Number(config.bcrypt_salt_number ?? 10);
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  return prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
};

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");

  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");

  if (!config.jwt.jwt_access_secret || !config.jwt.jwt_access_expires) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "JWT access secret/expiry not configured",
    );
  }

  const accessToken = jwtHelper.generateToken(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.jwt_access_secret,
    config.jwt.jwt_access_expires,
  );

  return {
    accessToken,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

const me = async (userId: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
};

export const AuthService = {
  bootstrapAdmin,
  login,
  me,
};

