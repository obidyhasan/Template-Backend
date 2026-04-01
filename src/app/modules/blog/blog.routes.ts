import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { BlogController } from "./blog.controller";

const router = Router();

router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getSingleBlog);

router.post("/", auth(Role.ADMIN), BlogController.createBlog);
router.patch("/:id", auth(Role.ADMIN), BlogController.updateBlog);
router.delete("/:id", auth(Role.ADMIN), BlogController.deleteBlog);

export const BlogRoutes = router;
