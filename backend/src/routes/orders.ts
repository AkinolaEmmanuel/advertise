import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { brands, orders } from "../db/schema.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/errors.js";
import { serializeOrder } from "../utils/serialize.js";

export const ordersRouter = Router();

ordersRouter.post(
  "/orders",
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        brand_id: z.string().uuid(),
        customer_name: z.string().min(1),
        customer_phone: z.string().nullable().optional(),
        total_amount: z.coerce.number().nonnegative(),
        items: z.array(z.unknown()).min(1),
      })
      .parse(req.body);

    const [brand] = await db.select({ id: brands.id }).from(brands).where(eq(brands.id, body.brand_id)).limit(1);
    if (!brand) throw new HttpError(404, "Brand not found");

    const [order] = await db
      .insert(orders)
      .values({
        brandId: body.brand_id,
        customerName: body.customer_name,
        customerPhone: body.customer_phone,
        totalAmount: String(body.total_amount),
        items: body.items,
      })
      .returning();

    res.status(201).json(serializeOrder(order));
  })
);
