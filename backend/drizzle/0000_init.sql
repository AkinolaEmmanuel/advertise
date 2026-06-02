CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "reset_token_hash" text,
  "reset_token_expires_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "brands" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "bio" text,
  "logo_url" text,
  "whatsapp" text,
  "instagram" text,
  "telegram" text,
  "subscription_status" text DEFAULT 'trial' NOT NULL,
  "plan_type" text DEFAULT 'free' NOT NULL,
  "is_verified" boolean DEFAULT false NOT NULL,
  "is_flagged" boolean DEFAULT false NOT NULL,
  "trial_ends_at" timestamp with time zone DEFAULT now() NOT NULL,
  "subscription_ends_at" timestamp with time zone,
  "theme_settings" jsonb DEFAULT '{"theme":"light","primaryColor":"#ffffff","fontFamily":"Inter"}'::jsonb NOT NULL,
  "bank_name" text,
  "account_number" text,
  "account_name" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "brand_id" uuid NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "price" numeric(12, 2) DEFAULT '0' NOT NULL,
  "image_url" text,
  "quantity" integer DEFAULT -1 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "brand_id" uuid NOT NULL,
  "customer_name" text NOT NULL,
  "customer_phone" text,
  "total_amount" numeric(12, 2) NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "items" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "analytic_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "brand_id" uuid NOT NULL,
  "event_type" text NOT NULL,
  "product_id" uuid,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "brands" ADD CONSTRAINT "brands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE cascade;
ALTER TABLE "orders" ADD CONSTRAINT "orders_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE cascade;
ALTER TABLE "analytic_events" ADD CONSTRAINT "analytic_events_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE cascade;
ALTER TABLE "analytic_events" ADD CONSTRAINT "analytic_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade;

CREATE UNIQUE INDEX "users_email_idx" ON "users" ("email");
CREATE UNIQUE INDEX "brands_user_id_idx" ON "brands" ("user_id");
CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" ("slug");
CREATE INDEX "products_brand_id_idx" ON "products" ("brand_id");
CREATE INDEX "orders_brand_id_idx" ON "orders" ("brand_id");
CREATE INDEX "analytic_events_brand_id_idx" ON "analytic_events" ("brand_id");
