import { z } from "zod";

const uuidSchema = z.string().uuid();

export const analyticsEventSchema = z.object({
  brand_id: uuidSchema,
  event_type: z.enum([
    "page_view",
    "product_click",
    "whatsapp_click",
    "transfer_click",
  ]),
  product_id: uuidSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const orderItemSchema = z.object({
  name: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(999),
  price: z.number().min(0).max(99_999_999),
});

export const createOrderSchema = z.object({
  brand_id: uuidSchema,
  customer_name: z.string().min(1).max(200),
  customer_phone: z.string().max(50).optional().nullable(),
  total_amount: z.number().min(0).max(99_999_999),
  items: z.array(orderItemSchema).min(1).max(50),
});

export function sanitizeMetadata(
  metadata: Record<string, unknown> | undefined,
  maxKeys = 20
): Record<string, unknown> {
  if (!metadata || typeof metadata !== "object") return {};
  const entries = Object.entries(metadata).slice(0, maxKeys);
  const out: Record<string, unknown> = {};
  for (const [key, value] of entries) {
    if (key.length > 64) continue;
    if (typeof value === "string" && value.length > 500) {
      out[key] = value.slice(0, 500);
    } else if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "string"
    ) {
      out[key] = value;
    }
  }
  return out;
}
