import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { db } from "../db/index.js";
import { brands, products, users } from "../db/schema.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/errors.js";
import { serializeBrand } from "../utils/serialize.js";

export const adminRouter = Router();

adminRouter.post(
  "/admin/setup",
  asyncHandler(async (req, res) => {
    const { email, password, setupKey } = z
      .object({ email: z.string().email(), password: z.string().min(6), setupKey: z.string().min(1) })
      .parse(req.body);

    if (!config.adminSetupKey || setupKey !== config.adminSetupKey) {
      throw new HttpError(401, "Unauthorized setup attempt");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const [existing] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (existing) throw new HttpError(409, "Admin already exists");

    const [user] = await db
      .insert(users)
      .values({ email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12) })
      .returning();

    res.status(201).json({ success: true, id: user.id, email: user.email });
  })
);

adminRouter.use("/admin", requireAuth, requireAdmin);

adminRouter.get(
  "/admin/brands",
  asyncHandler(async (_req, res) => {
    const rows = await db.select().from(brands);
    res.json(rows.map(serializeBrand));
  })
);

adminRouter.patch(
  "/admin/brands/:id",
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        is_verified: z.boolean().optional(),
        is_flagged: z.boolean().optional(),
        subscription_status: z.enum(["trial", "active", "expired", "cancelled"]).optional(),
        plan_type: z.enum(["free", "standard", "pro"]).optional(),
      })
      .parse(req.body);

    const [brand] = await db
      .update(brands)
      .set({
        isVerified: body.is_verified,
        isFlagged: body.is_flagged,
        subscriptionStatus: body.subscription_status,
        planType: body.plan_type,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, req.params.id))
      .returning();
    if (!brand) throw new HttpError(404, "Brand not found");
    res.json(serializeBrand(brand));
  })
);

adminRouter.delete(
  "/admin/brands/:id",
  asyncHandler(async (req, res) => {
    await db.delete(brands).where(eq(brands.id, req.params.id));
    res.json({ success: true });
  })
);

adminRouter.get(
  "/admin/stats",
  asyncHandler(async (_req, res) => {
    const [brandCount] = await db.select({ value: count() }).from(brands);
    const [activeCount] = await db.select({ value: count() }).from(brands).where(eq(brands.subscriptionStatus, "active"));
    const [productCount] = await db.select({ value: count() }).from(products);
    const brandRows = await db.select().from(brands);
    const revenue = brandRows.reduce((acc, brand) => {
      if (brand.planType === "standard") return acc + 2500;
      if (brand.planType === "pro") return acc + 5000;
      return acc;
    }, 0);

    res.json({
      totalBrands: brandCount.value,
      activeSubscriptions: activeCount.value,
      totalProducts: productCount.value,
      revenue,
      mrr: revenue,
    });
  })
);
