import type { InferSelectModel } from "drizzle-orm";
import type { analyticEvents, brands, orders, products, users } from "../db/schema.js";

type User = InferSelectModel<typeof users>;
type Brand = InferSelectModel<typeof brands>;
type Product = InferSelectModel<typeof products>;
type Order = InferSelectModel<typeof orders>;
type AnalyticEvent = InferSelectModel<typeof analyticEvents>;

function date(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function money(value: string | number) {
  return Number(value);
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    created_at: date(user.createdAt),
    updated_at: date(user.updatedAt),
  };
}

export function serializeBrand(brand: Brand) {
  return {
    id: brand.id,
    user_id: brand.userId,
    name: brand.name,
    slug: brand.slug,
    bio: brand.bio,
    logo_url: brand.logoUrl,
    whatsapp: brand.whatsapp,
    instagram: brand.instagram,
    telegram: brand.telegram,
    subscription_status: brand.subscriptionStatus,
    plan_type: brand.planType,
    is_verified: brand.isVerified,
    is_flagged: brand.isFlagged,
    trial_ends_at: date(brand.trialEndsAt),
    subscription_ends_at: date(brand.subscriptionEndsAt),
    theme_settings: brand.themeSettings,
    bank_name: brand.bankName,
    account_number: brand.accountNumber,
    account_name: brand.accountName,
    created_at: date(brand.createdAt),
    updated_at: date(brand.updatedAt),
  };
}

export function serializeProduct(product: Product) {
  return {
    id: product.id,
    brand_id: product.brandId,
    name: product.name,
    description: product.description,
    price: money(product.price),
    image_url: product.imageUrl,
    quantity: product.quantity,
    is_active: product.isActive,
    sort_order: product.sortOrder,
    created_at: date(product.createdAt),
    updated_at: date(product.updatedAt),
  };
}

export function serializeOrder(order: Order) {
  return {
    id: order.id,
    brand_id: order.brandId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    total_amount: money(order.totalAmount),
    status: order.status,
    items: order.items,
    created_at: date(order.createdAt),
    updated_at: date(order.updatedAt),
  };
}

export function serializeEvent(event: AnalyticEvent) {
  return {
    id: event.id,
    brand_id: event.brandId,
    event_type: event.eventType,
    product_id: event.productId,
    metadata: event.metadata,
    created_at: date(event.createdAt),
  };
}
