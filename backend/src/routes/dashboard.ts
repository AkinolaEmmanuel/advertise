import { and, asc, eq } from "drizzle-orm";
import { createHash } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { db } from "../db/index.js";
import { brands, orders, products } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../types.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/errors.js";
import { generateSlug, reservedSlugs } from "../utils/slug.js";
import { serializeBrand, serializeOrder, serializeProduct } from "../utils/serialize.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

async function currentBrand(userId: string) {
  const [brand] = await db.select().from(brands).where(eq(brands.userId, userId)).limit(1);
  if (!brand) throw new HttpError(404, "Brand not found");
  return brand;
}

dashboardRouter.get(
  "/dashboard/brand",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    res.json(serializeBrand(brand));
  })
);

dashboardRouter.patch(
  "/dashboard/brand",
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.userId;
    const brand = await currentBrand(userId);
    const body = z
      .object({
        name: z.string().min(2).max(80).optional(),
        slug: z.string().min(2).max(80).optional(),
        bio: z.string().nullable().optional(),
        logo_url: z.string().nullable().optional(),
        whatsapp: z.string().nullable().optional(),
        instagram: z.string().nullable().optional(),
        telegram: z.string().nullable().optional(),
        bank_name: z.string().nullable().optional(),
        account_number: z.string().nullable().optional(),
        account_name: z.string().nullable().optional(),
        theme_settings: z.record(z.string(), z.unknown()).optional(),
      })
      .parse(req.body);

    let slug = body.slug ? generateSlug(body.slug) : undefined;
    if (slug && reservedSlugs.has(slug)) throw new HttpError(400, "Reserved slug");
    if (slug && slug !== brand.slug) {
      const [existing] = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, slug)).limit(1);
      if (existing) throw new HttpError(409, "Slug is already taken");
    }

    const [updated] = await db
      .update(brands)
      .set({
        name: body.name,
        slug,
        bio: body.bio,
        logoUrl: body.logo_url,
        whatsapp: body.whatsapp,
        instagram: body.instagram,
        telegram: body.telegram,
        bankName: body.bank_name,
        accountNumber: body.account_number,
        accountName: body.account_name,
        themeSettings: body.theme_settings,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, brand.id))
      .returning();

    res.json(serializeBrand(updated));
  })
);

dashboardRouter.get(
  "/dashboard/products",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.brandId, brand.id))
      .orderBy(asc(products.sortOrder), asc(products.createdAt));
    res.json(rows.map(serializeProduct));
  })
);

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  price: z.coerce.number().nonnegative(),
  image_url: z.string().nullable().optional(),
  quantity: z.coerce.number().int().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.coerce.number().int().optional(),
});

const uploadSignatureSchema = z.object({
  purpose: z.enum(["product_image", "brand_logo"]),
});

function cloudinarySignature(params: Record<string, string | number>) {
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${payload}${config.cloudinaryApiSecret}`)
    .digest("hex");
}

dashboardRouter.post(
  "/dashboard/uploads/signature",
  asyncHandler(async (req, res) => {
    if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
      throw new HttpError(500, "Cloudinary upload signing is not configured");
    }

    uploadSignatureSchema.parse(req.body);

    const brand = await currentBrand((req as AuthedRequest).user.userId);
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `brands/${brand.slug}`;
    const signedParams = { folder, timestamp };

    res.json({
      api_key: config.cloudinaryApiKey,
      cloud_name: config.cloudinaryCloudName,
      folder,
      signature: cloudinarySignature(signedParams),
      timestamp,
      upload_url: `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
    });
  })
);

dashboardRouter.post(
  "/dashboard/products",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    const body = productSchema.parse(req.body);
    const [product] = await db
      .insert(products)
      .values({
        brandId: brand.id,
        name: body.name,
        description: body.description,
        price: String(body.price),
        imageUrl: body.image_url,
        quantity: body.quantity ?? -1,
        isActive: body.is_active ?? true,
        sortOrder: body.sort_order ?? 0,
      })
      .returning();
    res.status(201).json(serializeProduct(product));
  })
);

dashboardRouter.patch(
  "/dashboard/products/:id",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    const body = productSchema.partial().parse(req.body);
    const [product] = await db
      .update(products)
      .set({
        name: body.name,
        description: body.description,
        price: body.price === undefined ? undefined : String(body.price),
        imageUrl: body.image_url,
        quantity: body.quantity,
        isActive: body.is_active,
        sortOrder: body.sort_order,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, req.params.id), eq(products.brandId, brand.id)))
      .returning();
    if (!product) throw new HttpError(404, "Product not found");
    res.json(serializeProduct(product));
  })
);

dashboardRouter.delete(
  "/dashboard/products/:id",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    await db.delete(products).where(and(eq(products.id, req.params.id), eq(products.brandId, brand.id)));
    res.json({ success: true });
  })
);

dashboardRouter.get(
  "/dashboard/orders",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    const rows = await db.select().from(orders).where(eq(orders.brandId, brand.id)).orderBy(asc(orders.createdAt));
    res.json(rows.map(serializeOrder));
  })
);

dashboardRouter.patch(
  "/dashboard/orders/:id",
  asyncHandler(async (req, res) => {
    const brand = await currentBrand((req as AuthedRequest).user.userId);
    const { status } = z
      .object({ status: z.enum(["pending", "confirmed", "delivered", "cancelled"]) })
      .parse(req.body);
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(orders.id, req.params.id), eq(orders.brandId, brand.id)))
      .returning();
    if (!order) throw new HttpError(404, "Order not found");
    res.json(serializeOrder(order));
  })
);
