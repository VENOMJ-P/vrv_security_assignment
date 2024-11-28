const REDIS = require("ioredis");

const redisClient = new REDIS({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
