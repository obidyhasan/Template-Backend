import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { BkashService } from "./bkash.service";
import sendResponse from "../../shared/sendResponse";
import ApiError from "../../errors/ApiError";

const initiatePayment = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BkashService.createPayment(req.body);
    sendResponse(res, {
      statusCode: 200,
      message: "Payment Initiated",
      data: result,
      success: true,
    });
  },
);

const bkashCallback = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentID, status } = req.query;
    if (!paymentID || !status) {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }
    if (status === "success") {
      const result = await BkashService.executePayment(paymentID as string);
      if (result.statusCode === "0000") {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?trxID=${result.trxID}&paymentID=${result.paymentID}`);
      } else {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=${result.statusMessage}`);
      }
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }
  },
);

const queryPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentID } = req.body;
    if (!paymentID) {
      throw new ApiError(400, "paymentID required");
    }
    const result = await BkashService.queryPayment(paymentID);
    sendResponse(res, {
      statusCode: 200,
      message: "Payment Status Fetched",
      data: result,
      success: true,
    });
  },
);

const searchPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { trxID } = req.body;
    if (!trxID) {
      throw new ApiError(400, "transaction id required");
    }
    const result = await BkashService.searchPayment(trxID);
    sendResponse(res, {
      statusCode: 200,
      message: "Transaction Search Result",
      data: result,
      success: true,
    });
  },
);

const refundPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentID, trxID, refundAmount, sku, reason } = req.body;
    if (!paymentID || !trxID || !refundAmount || !sku || !reason) {
      throw new ApiError(400, "Invalid request");
    }
    const result = await BkashService.refundPayment(
      paymentID,
      trxID,
      refundAmount,
      sku,
      reason,
    );
    sendResponse(res, {
      statusCode: 200,
      message: "Refund Processed",
      data: result,
      success: true,
    });
  },
);

const refundStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentID, trxID } = req.body;
    if (!paymentID || !trxID) {
      throw new ApiError(400, "Invalid request");
    }
    const result = await BkashService.refundStatus(paymentID, trxID);
    sendResponse(res, {
      statusCode: 200,
      message: "Refund Status Fetched",
      data: result,
      success: true,
    });
  },
);

export const BkashController = {
  initiatePayment,
  bkashCallback,
  queryPayment,
  searchPayment,
  refundPayment,
  refundStatus,
};
