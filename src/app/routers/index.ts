import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.routes";
import { ServiceRoutes } from "../modules/service/service.routes";
import { FaqRoutes } from "../modules/faq/faq.routes";
import { LinkRoutes } from "../modules/link/link.routes";
import { HeroRoutes } from "../modules/hero/hero.routes";
import { NoticeRoutes } from "../modules/notice/notice.routes";
import { UploadRoutes } from "../modules/upload/upload.routes";
import { bkashRouter } from "../modules/bkash/bkash.route";
import { BlogRoutes } from "../modules/blog/blog.routes";
import { AnalyticsRoutes } from "../modules/analytics/analytics.route";

const router = Router();
const moduleRouters = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/faqs",
    route: FaqRoutes,
  },
  {
    path: "/links",
    route: LinkRoutes,
  },
  {
    path: "/hero-images",
    route: HeroRoutes,
  },
  {
    path: "/notices",
    route: NoticeRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
  {
    path: "/uploads",
    route: UploadRoutes,
  },
  {
    path: "/bkash",
    route: bkashRouter,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
