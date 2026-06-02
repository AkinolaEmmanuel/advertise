import { and, asc, eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/index.js";
import { brands, products } from "../db/schema.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/errors.js";
import { serializeBrand, serializeProduct } from "../utils/serialize.js";

export const storefrontRouter = Router();

storefrontRouter.get(
  "/brands",
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select()
      .from(brands)
      .where(eq(brands.isFlagged, false))
      .orderBy(asc(brands.createdAt));
    res.json(rows.map(serializeBrand));
  })
);

storefrontRouter.get(
  "/storefront/:slug",
  asyncHandler(async (req, res) => {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, req.params.slug)).limit(1);
    if (!brand || brand.isFlagged) {
      throw new HttpError(404, "Brand not found");
    }

    const productRows = await db
      .select()
      .from(products)
      .where(and(eq(products.brandId, brand.id), eq(products.isActive, true)))
      .orderBy(asc(products.sortOrder), asc(products.createdAt));

    res.json({ brand: serializeBrand(brand), products: productRows.map(serializeProduct) });
  })
);
