import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    resetTokenHash: text("reset_token_hash"),
    resetTokenExpiresAt: timestamp("reset_token_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    bio: text("bio"),
    logoUrl: text("logo_url"),
    whatsapp: text("whatsapp"),
    instagram: text("instagram"),
    telegram: text("telegram"),
    subscriptionStatus: text("subscription_status").default("trial").notNull(),
    planType: text("plan_type").default("free").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    isFlagged: boolean("is_flagged").default(false).notNull(),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }).defaultNow().notNull(),
    subscriptionEndsAt: timestamp("subscription_ends_at", { withTimezone: true }),
    themeSettings: jsonb("theme_settings")
      .$type<Record<string, unknown>>()
      .default(sql`'{"theme":"light","primaryColor":"#ffffff","fontFamily":"Inter"}'::jsonb`)
      .notNull(),
    bankName: text("bank_name"),
    accountNumber: text("account_number"),
    accountName: text("account_name"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: uniqueIndex("brands_user_id_idx").on(table.userId),
    slugIdx: uniqueIndex("brands_slug_idx").on(table.slug),
  })
);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
  imageUrl: text("image_url"),
  quantity: integer("quantity").default(-1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(),
  items: jsonb("items").$type<unknown[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const analyticEvents = pgTable("analytic_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  brand: one(brands),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  user: one(users, { fields: [brands.userId], references: [users.id] }),
  products: many(products),
  orders: many(orders),
  analyticEvents: many(analyticEvents),
}));

export const productsRelations = relations(products, ({ one }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  brand: one(brands, { fields: [orders.brandId], references: [brands.id] }),
}));

export const analyticEventsRelations = relations(analyticEvents, ({ one }) => ({
  brand: one(brands, { fields: [analyticEvents.brandId], references: [brands.id] }),
  product: one(products, { fields: [analyticEvents.productId], references: [products.id] }),
}));
