# pòlówó — Feature inventory

Last updated: May 2026  
Stack: Next.js 16 (App Router), Supabase, Tailwind v4, Zustand, optional Resend & Paystack

This document lists what exists in the codebase today, whether it works end-to-end, and what is incomplete or unused. Status is based on code review, not marketing copy.

---

## Status legend

| Status | Meaning |
|--------|---------|
| **Functional** | Works end-to-end for its intended use today |
| **Partial** | Works in some paths, or data is saved but UX/backend is incomplete |
| **Dormant** | Code exists but disabled, unreachable from UI, or inactive by design |
| **Broken** | Likely fails without extra config or has a clear wiring bug |
| **Not implemented** | Placeholder UI or missing behavior |

---

## Executive summary

**The core product loop is functional:**

> Sign up → dashboard → add products & checkout contact → public storefront at `/{slug}` → customer cart → WhatsApp / bank transfer checkout → order logged → merchant manages orders & basic analytics

**Not active in production intent:**

- Platform subscription billing (product is **free forever**)
- Customer Paystack checkout on storefront
- Resend welcome / custom reset emails (templates exist, not wired)
- Admin revenue/growth analytics (placeholders)
- Server-side stock decrement on order
- Instagram / Telegram on storefront (saved in settings only)

**Requires configuration:**

- Supabase env vars (required for almost everything)
- `ADMIN_EMAILS` for `/admin` access
- Supabase Auth SMTP for forgot-password emails (not Resend)
- `ENABLE_EMAIL=true` + Resend keys only if you wire email sending
- Run `supabase/migrations/20260530_tighten_public_writes.sql` on existing DBs so orders/analytics use API routes

---

## 1. Landing & marketing

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Home page | `/` | **Functional** | Hero, features, how-it-works, testimonials, pricing, CTA, footer, mobile nav |
| Free pricing messaging | `components/landing/Pricing.tsx` | **Functional** | Single ₦0 plan; matches `PLATFORM_IS_FREE` in `lib/platform.ts` |
| Brand directory | `/brands` | **Functional** | Lists non-flagged brands with `active` or `trial` status; search; links to `/{slug}` |
| Reserved slugs | `lib/slug.ts` | **Functional** | Prevents collision with `/admin`, `/dashboard`, `/brands`, etc. |

---

## 2. Authentication & session

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Sign up | `/signup`, `POST /api/auth/signup` | **Functional** | Creates auth user + brand; slug availability check; auto sign-in → dashboard. Needs `SUPABASE_SERVICE_ROLE_KEY`. Sets `subscription_status: active`, `plan_type: free`. |
| Slug availability | `GET /api/auth/check-availability` | **Functional** | Live preview on signup; rejects reserved/taken slugs |
| Login | `/login` | **Functional** | Email/password via Supabase client |
| Post-login redirect | `GET /api/auth/post-login` | **Functional** | Admins (`ADMIN_EMAILS`) → `/admin`; others → `/dashboard` |
| OAuth / magic link callback | `/auth/callback` | **Functional** | Exchanges code for session; redirects to `next` or `/dashboard` |
| Session protection | `proxy.ts` → `lib/supabase/middleware.ts` | **Functional** | Protects `/dashboard` and `/admin`; redirects authed users away from `/login` and `/signup` |
| Missing Supabase config | Middleware | **Functional** | Protected routes redirect to `/login?error=config` (fail closed) |
| 2-day session expiry | Middleware | **Functional** | Signs out if `last_sign_in_at` > 48 hours |
| Flagged account lockout | Middleware + storefront | **Functional** | Flagged merchants signed out on dashboard; customers see suspension page |
| Forgot password | `/forgot-password` | **Partial** | Uses Supabase `resetPasswordForEmail` (not Resend). Redirect goes to `/auth/callback` without `next=/reset-password`. Depends on Supabase Auth email config. |
| Reset password page | `/reset-password` | **Partial** | `updateUser({ password })` works if user already has recovery session; flow from forgot-password is awkward |
| Custom reset email (Resend) | `POST /api/mail/reset-password` | **Dormant** | Implemented but **no UI calls it** |
| Welcome email on signup | `lib/email-templates.ts` | **Not implemented** | Template exists; signup route never sends mail |
| Signup rate limiting | `POST /api/auth/signup` | **Not implemented** | No CAPTCHA or rate limit |

---

## 3. Merchant dashboard

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Dashboard shell | `/dashboard/*` | **Functional** | Sidebar, mobile nav, brand context |
| Overview | `/dashboard` | **Functional** | Product count, store link, quick actions |
| Checkout setup banner | Dashboard layout | **Functional** | Shows until WhatsApp **or** bank account number is set (`lib/checkout-contact.ts`) |
| Products — list / add / edit / delete | `/dashboard/products` | **Functional** | CRUD via Supabase; toggle active/inactive |
| Product images | `ProductForm.tsx` | **Functional** | Upload to Supabase `product-images` bucket (5MB limit) |
| Stock tracking (merchant) | Product form | **Functional** | Quantity ≥ 0 or `-1` for unlimited |
| Orders — list & status updates | `/dashboard/orders` | **Functional** | pending → confirmed / delivered / cancelled. No order detail page. |
| Settings — brand profile | `/dashboard/settings` | **Functional** | Name, bio, slug, logo upload |
| Settings — theme | `/dashboard/settings` | **Functional** | Light/dark, primary color, font family |
| Settings — checkout contact | `/dashboard/settings` | **Functional** | WhatsApp and/or bank details; validation requires at least one contact method |
| Settings — Instagram / Telegram | `/dashboard/settings` | **Partial** | Saved to DB; **not shown on storefront** |
| Settings — subscription UI | `/dashboard/settings` | **Functional** (free) | Shows “free forever” copy; no payment CTA |
| Store preview | `/dashboard/preview` | **Functional** | iframe + open in new tab for `/{slug}` |
| Merchant analytics | `/dashboard/analytics` | **Functional** | 30-day visits, WhatsApp clicks, transfer clicks, conversion %. No charts (`dailyVisits` fetched but not rendered). |
| Legacy subscription renew | `/dashboard/renew` | **Dormant** | Redirects to `/dashboard` |
| Auto-heal legacy subscription | `POST /api/user/check-status` | **Functional** | On dashboard load: `trial` / `expired` / `cancelled` → `active` + `free` while platform is free |

---

## 4. Public storefront

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Store page | `/{slug}` | **Functional** | Themed header, product grid, search, share |
| Product modal | `ProductModal.tsx` | **Functional** | View details, add to cart |
| Cart (per-store) | `stores/cart.ts`, `Cart.tsx` | **Functional** | Persisted in localStorage (`polowo-cart-v2`); scoped by `brandId` |
| Stock limits in cart | `lib/stock.ts` | **Functional** | Blocks over-quantity and out-of-stock adds in UI |
| Checkout — WhatsApp | `Cart.tsx` | **Functional** | Logs order, opens WhatsApp with order message |
| Checkout — bank transfer | `Cart.tsx` | **Functional** | Shows account details; “Send receipt” via WhatsApp |
| Checkout gating | `Cart.tsx` | **Functional** | Blocked if merchant has no WhatsApp or account number |
| Order logging | `POST /api/orders` | **Functional** | Validated server insert; total must match line items |
| Event analytics | `POST /api/analytics/event` | **Functional** | `page_view`, `product_click`, `whatsapp_click`, `transfer_click` |
| Flagged / suspended store | `app/[slug]/page.tsx` | **Functional** | Customers see unavailable message |
| Paystack checkout | — | **Not implemented** | Storefront uses WhatsApp + bank only |
| Instagram / Telegram links | — | **Not implemented** | Not rendered on storefront |

---

## 5. Admin panel

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Admin access | `app/admin/layout.tsx` | **Functional** | Requires login + email in `ADMIN_EMAILS` |
| Admin overview | `/admin` | **Partial** | Brand/product counts work; MRR and “Active Premium” use legacy paid-plan math; growth chart is placeholder (`platformGrowth: 0`) |
| Brands management | `/admin/brands` | **Functional** | List, edit plan/status, verify, flag, delete |
| Moderation queue | `/admin/moderation` | **Functional** | Flagged brands; clear/unflag actions |
| Growth analytics | `/admin/growth` | **Not implemented** | Static “Coming Soon” page |
| One-time admin setup | `POST /api/admin/setup` | **Functional** (ops) | Creates admin user with `ADMIN_SETUP_KEY`; not linked from UI |

---

## 6. API routes

| Route | Auth | Status | Notes |
|-------|------|--------|-------|
| `POST /api/auth/signup` | Service role | **Functional** | Public; creates user + brand |
| `GET /api/auth/check-availability` | Service role | **Functional** | Public slug check |
| `GET /api/auth/post-login` | Session / Bearer | **Functional** | Admin vs dashboard redirect |
| `POST /api/orders` | Service role | **Functional** | Public write with Zod validation; no stock decrement; no rate limit |
| `POST /api/analytics/event` | Service role | **Functional** | Public write with validation |
| `GET /api/analytics/stats` | Merchant session | **Functional** | Scoped to own brand |
| `POST /api/user/check-status` | Merchant session | **Functional** | Free-platform subscription heal |
| `GET/POST/PATCH/DELETE /api/admin/*` | Session + `ADMIN_EMAILS` | **Functional** | Admin operations via service role |
| `POST /api/admin/setup` | `ADMIN_SETUP_KEY` | **Functional** | One-time setup |
| `POST /api/paystack/initialize` | Merchant session | **Dormant** / **Partial** | Subscriptions return 403 when free; order type exists but storefront never calls it |
| `GET /api/paystack/verify` | None | **Dormant** | Subscription activation path unused |
| `POST /api/paystack/webhook` | HMAC | **Dormant** | Needs `PAYSTACK_SECRET_KEY`; inactive in practice |
| `POST /api/mail/reset-password` | None | **Dormant** | Unused by forgot-password UI |
| `POST /api/seed` | None | **Functional** (dev) | Blocked when `NODE_ENV === production` |

**Note:** Middleware (`proxy.ts`) excludes `/api/*`. Each route enforces its own auth.

---

## 7. Email (Resend)

| Feature | Status | Notes |
|---------|--------|-------|
| Resend send helper | **Partial** | `lib/mail.ts` sends only when `ENABLE_EMAIL=true` and `RESEND_API_KEY` set; otherwise logs “Mail Skipped” |
| Welcome email template | **Dormant** | `welcomeEmail()` in `lib/email-templates.ts`; never called |
| Password reset via Resend | **Dormant** | API route exists; forgot-password uses Supabase instead |
| Transactional emails (orders, etc.) | **Not implemented** | No merchant/customer order notifications |

---

## 8. Paystack & payments

| Feature | Status | Notes |
|---------|--------|-------|
| Platform subscription billing | **Dormant** | `PLATFORM_IS_FREE = true`; initialize returns 403 for subscriptions; no paywall UI |
| Merchant plan payment UI | **Dormant** | Legacy renew route redirects; settings show free plan only |
| Customer Paystack checkout | **Not implemented** | `lib/paystack.ts` + initialize `type=order` exist; storefront never integrates |
| Webhook + verify handlers | **Dormant** | Code from paid era; inactive without keys and UI |
| Paystack plan constants | **Dormant** | `PLANS` in `lib/paystack.ts` (legacy ₦2,500 / ₦5,000) |

---

## 9. Subscriptions (platform)

| Feature | Status | Notes |
|---------|--------|-------|
| Free platform mode | **Functional** | No merchant lockout for subscription status |
| Signup defaults | **Functional** | New brands: `active` + `free` |
| Legacy DB fields | **Partial** | `subscription_status`, `plan_type`, `trial_ends_at` still in schema and admin UI |
| Admin MRR stats | **Partial** | Still calculates ₦2,500/₦5,000 for standard/pro plans; misleading while platform is free |
| Auto-upgrade on dashboard load | **Functional** | Heals old trial/expired/cancelled rows to active/free |

---

## 10. Analytics

| Feature | Status | Notes |
|---------|--------|-------|
| Storefront event ingestion | **Functional** | Server-validated inserts via API |
| Merchant dashboard stats | **Functional** | 30-day aggregates; three stat cards |
| Daily visit chart | **Partial** | Data computed in API; not rendered in UI |
| Product click metrics | **Partial** | Events logged; not shown in merchant analytics UI |
| Admin growth dashboard | **Not implemented** | Placeholder page only |

---

## 11. Stock & inventory

| Feature | Status | Notes |
|---------|--------|-------|
| Track stock per product | **Functional** | Merchant sets quantity or unlimited (`-1`) |
| Cart quantity enforcement | **Functional** | Client-side caps in cart and product modal |
| Decrement stock on order | **Not implemented** | `POST /api/orders` does not update product quantity; overselling possible across browsers/sessions |

---

## 12. File uploads & images

| Feature | Status | Notes |
|---------|--------|-------|
| Product images | **Functional** | Supabase Storage `product-images` bucket |
| Brand logo | **Functional** | Upload in settings; stored under `logos/{brandId}` |
| Next.js image domains | **Functional** | `next.config.ts` allows `**.supabase.co` |
| Per-brand storage isolation | **Partial** | RLS is bucket-level for authenticated users, not strict per-brand path policies |

---

## 13. Security & middleware

| Feature | Status | Notes |
|---------|--------|-------|
| Page route protection | **Functional** | Dashboard and admin require session |
| Admin email allowlist | **Functional** | Server-side via `ADMIN_EMAILS` + `lib/admin.ts` |
| Analytics stats scoped to owner | **Functional** | Fixed: requires auth + own brand |
| Orders/analytics public writes | **Functional** | Via validated API + service role (not open client INSERT if migration applied) |
| API rate limiting | **Not implemented** | Signup, orders, analytics have no rate limits |
| CI (lint + build) | **Not implemented** | No GitHub Actions workflow in repo |
| Health check endpoint | **Not implemented** | — |
| Error monitoring (Sentry, etc.) | **Not implemented** | — |

---

## 14. Dev & seed tools

| Feature | Status | Notes |
|---------|--------|-------|
| `POST /api/seed` | **Functional** (dev) | Creates test admin + merchant accounts; **403 in production** |
| `npm run seed` | **Broken** | `scripts/seed.js` calls `localhost:4000`; dev server defaults to port **3000** |
| `npm run seed:direct` | **Partial** | `scripts/seed-direct.js` uses `--env-file=.env.local` (your env may be `.env` instead) |

---

## 15. User journeys (quick reference)

### Works today

1. **New merchant:** `/signup` → dashboard → add products → set WhatsApp or bank number → share `/{slug}`
2. **Customer:** Visit storefront → add to cart → checkout via WhatsApp or bank transfer → order appears in merchant dashboard
3. **Merchant:** Manage orders, view basic analytics, customize theme and slug
4. **Admin:** Manage brands, flag/unflag, verify (if email in `ADMIN_EMAILS`)

### Does not work or is incomplete

1. **Pay for platform plan** — free; Paystack subscription flow disabled
2. **Customer pays via Paystack on storefront** — not built
3. **Welcome email after signup** — not sent
4. **Forgot password via Resend** — uses Supabase Auth email instead; reset page flow is weak
5. **Instagram/Telegram on store** — saved but not displayed
6. **Automatic inventory deduction** — manual stock only enforced in cart UI
7. **Admin revenue/growth reporting** — placeholders
8. **Order email notifications** — not implemented

---

## 16. Environment dependencies by feature

| Feature | Required env / config |
|---------|------------------------|
| App (core) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL` |
| Admin panel | `ADMIN_EMAILS` |
| Forgot password | Supabase Auth email (SMTP) configured in Supabase dashboard |
| Resend emails | `ENABLE_EMAIL=true`, `RESEND_API_KEY`, `FROM_EMAIL` |
| Paystack (if re-enabled) | `PAYSTACK_SECRET_KEY`, plan codes, webhook URL |
| Orders/analytics (hardened DB) | Run `supabase/migrations/20260530_tighten_public_writes.sql` |

---

## Related files

- Platform mode: `lib/platform.ts`
- Checkout requirements: `lib/checkout-contact.ts`
- Database schema: `supabase/schema.sql`
- Deployment: `README.md`, `.env.example`
