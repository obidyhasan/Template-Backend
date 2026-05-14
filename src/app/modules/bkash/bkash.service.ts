import axios from "axios";
import { redisClient } from "../../config/redis.config";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { CreatePaymentPayload } from "./bkash.interface";
import httpStatus from "http-status";

const TOKEN_KEY = "bkash:id_token";

const getCachedToken = async (): Promise<string | null> => {
  if (!redisClient.isReady) return null;
  try {
    return await redisClient.get(TOKEN_KEY);
  } catch {
    return null;
  }
};

const cacheToken = async (token: string) => {
  if (!redisClient.isReady) return;
  try {
    await redisClient.set(TOKEN_KEY, token, {
      EX: 3600,
    });
  } catch {
    // Cache failures should not block payment flow.
  }
};

const getToken = async (): Promise<string> => {
  const cached = await getCachedToken();
  if (cached) return cached;
  return grantToken();
};

const grantToken = async (): Promise<string> => {
  const { data } = await axios.post(
    `${config.bkash.base_url}/tokenized/checkout/token/grant`,
    {
      app_key: config.bkash.api_key,
      app_secret: config.bkash.api_secret,
    },
    {
      headers: {
        username: config.bkash.username,
        password: config.bkash.password,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  if (!data?.id_token) {
    throw new ApiError(httpStatus.BAD_GATEWAY, "Failed to obtain bkash token");
  }
  await cacheToken(data.id_token);
  return data.id_token;
};

const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    "X-App-Key": config.bkash.api_key,
  };
};

const createPayment = async (payload: CreatePaymentPayload) => {
  if (payload.amount < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  const { data } = await axios.post(
    `${config.bkash.base_url}/tokenized/checkout/create`,
    {
      mode: "0011",
      currency: "BDT",
      intent: "sale",
      amount: payload.amount.toFixed(2),
      callbackURL: payload.callbackURL,
      payerReference: payload.payerReference || "1",
      merchantInvoiceNumber: payload.orderID,
    },
    {
      headers: await getAuthHeaders(),
    },
  );
  if (!data?.bkashURL || !data?.paymentID) {
    throw new ApiError(httpStatus.BAD_GATEWAY, "Failed to create payment");
  }
  return data;
};

const executePayment = async (paymentID: string) => {
  const { data } = await axios.post(
    `${config.bkash.base_url}/tokenized/checkout/execute`,
    { paymentID },
    { headers: await getAuthHeaders() },
  );
  return data;
};

const queryPayment = async (paymentID: string) => {
  const { data } = await axios.post(
    `${config.bkash.base_url}/tokenized/checkout/payment/status`,
    { paymentID },
    { headers: await getAuthHeaders() },
  );
  return data;
};

const searchPayment = async (trxID: string) => {
  try {
    const { data } = await axios.post(
      `${config.bkash.base_url}/tokenized/checkout/general/searchTran`,
      {
        trxID,
      },
      {
        headers: await getAuthHeaders(),
      },
    );
    return data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_GATEWAY, "Failed to search payment");
  }
};

const refundPayment = async (
  paymentID: string,
  trxID: string,
  refundAmount: string,
  sku: string,
  reason: string,
) => {
  try {
    const { data } = await axios.post(
      `${config.bkash.base_url}/v2/tokenized-checkout/refund/payment/transaction`,
      {
        paymentID,
        trxID,
        refundAmount,
        sku,
        reason,
      },
      {
        headers: await getAuthHeaders(),
      },
    );
    return data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_GATEWAY, "Failed to refund payment");
  }
};

const refundStatus = async (paymentID: string, trxID: string) => {
  const { data } = await axios.post(
    `${config.bkash.base_url}/v2/tokenized-checkout/refund/payment/status`,
    {
      paymentID,
      trxID,
    },
    {
      headers: await getAuthHeaders(),
    },
  );
  return data;
};

export const BkashService = {
  createPayment,
  executePayment,
  queryPayment,
  searchPayment,
  refundPayment,
  refundStatus,
};
