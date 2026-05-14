import { createClient } from "redis";
import config from ".";

export const redisClient = createClient({
  username: config.redis.username,
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
    reconnectStrategy: () => false,
  },
});

let hasLoggedRedisError = false;

redisClient.on("error", (err) => {
  if (hasLoggedRedisError) return;
  hasLoggedRedisError = true;
  console.warn(
    "Redis is unavailable. Continuing without Redis cache in development.",
  );
});

export const connectRedis = async () => {
  if (!config.redis.enabled) {
    console.log("Redis is disabled for this environment.");
    return false;
  }

  if (!config.redis.host || !config.redis.port) {
    console.warn("Redis host/port missing. Skipping Redis connection.");
    return false;
  }

  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Redis Client Connected");
      return true;
    } catch {
      return false;
    }
  }

  return redisClient.isReady;
};
