import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { config } from "./config.js";
import { requestLogger } from "./middleware/request-logger.js";
import { adminRouter } from "./routes/admin.js";
import { analyticsRouter } from "./routes/analytics.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { mailRouter } from "./routes/mail.js";
import { ordersRouter } from "./routes/orders.js";
import { paymentsRouter } from "./routes/payments.js";
import { storefrontRouter } from "./routes/storefront.js";
import { HttpError } from "./utils/errors.js";
import { logger } from "./utils/logger.js";

export const app = express();

app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(requestLogger);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api", storefrontRouter);
app.use("/api", dashboardRouter);
app.use("/api", ordersRouter);
app.use("/api", analyticsRouter);
app.use("/api", adminRouter);
app.use("/api", paymentsRouter);
app.use("/api", mailRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.flatten() });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  logger.error(error);
  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);
