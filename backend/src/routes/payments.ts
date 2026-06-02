import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { db } from "../db/index.js";
import { brands } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { initializeTransaction, PLANS, verifyTransaction } from "../services/paystack.js";
import type { AuthedRequest } from "../types.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/errors.js";

export const paymentsRouter = Router();

paymentsRouter.post(
  "/paystack/initialize",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = (req as AuthedRequest).user;
    const body = z
      .object({
        type: z.enum(["subscription", "order"]),
        plan: z.enum(["standard", "pro"]).optional(),
        items: z.array(z.any()).optional(),
        brandId: z.string().uuid().optional(),
        brandName: z.string().optional(),
      })
      .parse(req.body);

    if (body.type === "subscription") {
      const planConfig = body.plan ? PLANS[body.plan] : undefined;
      if (!planConfig) throw new HttpError(400, "Invalid plan");
      const [brand] = await db.select().from(brands).where(eq(brands.userId, user.userId)).limit(1);
      if (!brand) throw new HttpError(404, "Brand not found");
      const reference = `sub_${brand.id}_${Date.now()}`;
      const result = await initializeTransaction({
        email: user.email,
        amount: planConfig.amount,
        reference,
        callback_url: `${config.appUrl}/api/paystack/verify?type=subscription`,
        metadata: { brand_id: brand.id, plan: body.plan, type: "subscription" },
      });
      res.json({ authorization_url: result.data.authorization_url, reference: result.data.reference });
      return;
    }

    if (!body.items || !body.brandId) throw new HttpError(400, "Missing order data");
    const total = body.items.reduce((sum, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    const reference = `ord_${body.brandId}_${Date.now()}`;
    const result = await initializeTransaction({
      email: user.email,
      amount: total * 100,
      reference,
      callback_url: `${config.appUrl}/api/paystack/verify?type=order`,
      metadata: { brand_id: body.brandId, brand_name: body.brandName, items: body.items, type: "order" },
    });
    res.json({ authorization_url: result.data.authorization_url, reference: result.data.reference });
  })
);

paymentsRouter.get(
  "/paystack/verify",
  asyncHandler(async (req, res) => {
    const reference = z.string().min(1).parse(req.query.reference);
    const type = z.string().optional().parse(req.query.type);
    const result = await verifyTransaction(reference);
    const metadata = result.data.metadata || {};

    if (type === "subscription" && metadata.brand_id) {
      const plan = metadata.plan === "pro" ? "pro" : "standard";
      await db
        .update(brands)
        .set({
          subscriptionStatus: "active",
          planType: plan,
          subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        })
        .where(eq(brands.id, String(metadata.brand_id)));
      res.redirect(`${config.appUrl}/dashboard/settings?payment=success`);
      return;
    }

    res.redirect(`${config.appUrl}/dashboard?payment=success`);
  })
);

paymentsRouter.post(
  "/paystack/webhook",
  asyncHandler(async (req, res) => {
    const signature = req.get("x-paystack-signature") || "";
    const rawBody = JSON.stringify(req.body);
    const hash = crypto.createHmac("sha512", config.paystackSecretKey).update(rawBody).digest("hex");

    if (config.paystackSecretKey && hash !== signature) {
      throw new HttpError(401, "Invalid signature");
    }

    const event = req.body;
    const metadata = event?.data?.metadata;
    if (event?.event === "charge.success" && metadata?.type === "subscription" && metadata?.brand_id) {
      const plan = metadata.plan === "pro" ? "pro" : "standard";
      await db
        .update(brands)
        .set({
          subscriptionStatus: "active",
          planType: plan,
          subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        })
        .where(eq(brands.id, metadata.brand_id));
    }

    res.json({ received: true });
  })
);
