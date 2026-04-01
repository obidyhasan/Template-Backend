import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../config";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bearer = req.headers.authorization;
      const token =
        req.cookies.accessToken ||
        (typeof bearer === "string" && bearer.startsWith("Bearer ")
          ? bearer.split(" ")[1]
          : undefined);
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "No Token Received");
      }

      const verifyUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_access_secret as string,
      );

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not permitted to view this route!",
        );
      }

      req.user = verifyUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
