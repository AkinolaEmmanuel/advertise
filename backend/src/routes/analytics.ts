import { and, eq, gte } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { analyticEvents, brands } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../types.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyticsRouter = Router();

analyticsRouter.post(
  "/analytics/events",
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        brand_id: z.string().uuid(),
        event_type: z.enum(["page_view", "product_click", "whatsapp_click", "transfer_click"]),
        product_id: z.string().uuid().nullable().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
      .parse(req.body);

    await db.insert(analyticEvents).values({
      brandId: body.brand_id,
      eventType: body.event_type,
      productId: body.product_id,
      metadata: body.metadata || {},
    });
    res.status(201).json({ success: true });
  })
);

analyticsRouter.get(
  "/analytics/stats",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.userId;
    const [brand] = await db.select().from(brands).where(eq(brands.userId, userId)).limit(1);
    if (!brand) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const events = await db
      .select()
      .from(analyticEvents)
      .where(and(eq(analyticEvents.brandId, brand.id), gte(analyticEvents.createdAt, since)));

    const visits = events.filter((event) => event.eventType === "page_view").length;
    const whatsappClicks = events.filter((event) => event.eventType === "whatsapp_click").length;
    const transferClicks = events.filter((event) => event.eventType === "transfer_click").length;
    const dailyViews = events
      .filter((event) => event.eventType === "page_view")
      .reduce<Record<string, number>>((acc, event) => {
        const date = event.createdAt.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    res.json({
      visits,
      totalVisits: visits,
      whatsappClicks,
      transferClicks,
      conversionRate: visits > 0 ? Math.round((whatsappClicks / visits) * 100) : 0,
      dailyViews,
      dailyVisits: dailyViews,
    });
  })
);
