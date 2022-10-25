import type { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// unknown types
const applyMiddleware = (middleware: any) => (request: any, response: any) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result: any) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

const getIP = (request: any) =>
  request.ip ||
  request.headers["x-forwarded-for"] ||
  request.headers["x-real-ip"] ||
  request.connection.remoteAddress;

export const getRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500,
} = {}) => [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
];

const middlewares = getRateLimitMiddlewares();

const rateLimiter = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await Promise.all(
      middlewares.map(applyMiddleware).map((middleware) => middleware(req, res))
    );
    return res.status(200).json({ status: "OK", message: "Request allowed." });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "FAILED", message: "Internal server error." });
  }
};

export default rateLimiter;
