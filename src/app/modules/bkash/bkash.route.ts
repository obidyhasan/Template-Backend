import { Router } from "express";
import { BkashController } from "./bkash.controller";

const route = Router();

route.post("/initiate", BkashController.initiatePayment);
route.get("/callback", BkashController.bkashCallback);
route.post("/query", BkashController.queryPayment);
route.post("/search", BkashController.searchPayment);
route.post("/refund", BkashController.refundPayment);
route.post("/refund-status", BkashController.refundStatus);

export const bkashRouter = route;
