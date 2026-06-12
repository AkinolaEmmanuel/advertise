import type { RequestHandler } from "express";
import { logger } from "../utils/logger.js";

function levelForStatus(statusCode: number): "info" | "warn" | "error" {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "warn";
  return "info";
}

export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const method = req.method.padEnd(6);
    const path = req.originalUrl || req.url;
    let message = `${method} ${path} ${res.statusCode} ${durationMs.toFixed(1)}ms`;

    if (logger.isDebugEnabled()) {
      message += ` ip=${req.ip || "-"} ua=${req.get("user-agent") || "-"}`;
    }

    logger[levelForStatus(res.statusCode)](message);
  });

  next();
};
