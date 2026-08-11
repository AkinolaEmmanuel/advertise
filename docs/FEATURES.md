# pòlówó — Feature inventory

Last updated: April 2026  
Stack: **Next.js 16** (frontend) + **Express / PostgreSQL / Drizzle** (backend API)

This document describes what the **frontend** implements today and how it connects to the backend. Status is based on code review, not marketing copy.

---

## Status legend

| Status | Meaning |
|--------|---------|
| **Functional** | Works end-to-end for its intended use today |
| **Partial** | Works in some paths, or UI/backend wiring is incomplete |
| **Dormant** | Code exists but disabled, unreachable from UI, or inactive by design |
| **Not implemented** | Placeholder UI or missing behavior |

---

## Executive summary

**The core product loop is functional:**

> Sign up → dashboard → add products & checkout contact → public storefront at `/{slug}` → customer cart → WhatsApp / bank transfer checkout → order logged → merchant manages orders & basic analytics

**Architecture**

- `frontend/` — Next.js App Router UI; JWT stored in `localStorage`; calls API via `/api/*` rewrites
- `backend/` — Express API, PostgreSQL, Drizzle ORM (see backend README for server-side details)

**Not active in production intent**

- Platform subscription billing (`PLATFORM_IS_FREE = true` in `frontend/lib/platform.ts`)
- Customer Paystack checkout on storefront
- Admin revenue/growth analytics (placeholders)
- Server-side stock decrement on order

**Requires configuration**

- Backend running with `DATABASE_URL`, `JWT_SECRET`, Cloudinary keys (for uploads)
- `NEXT_PUBLIC_API_URL` for SSR storefront pages
- `NEXT_PUBLIC_ADMIN_EMAILS` matching backend `ADMIN_EMAILS` for admin UI routing
- Resend + `ENABLE_EMAIL=true` on backend for password-reset emails

---

## 1. Landing & marketing

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Home page | `/` | **Functional** | Hero, features, how-it-works, testimonials, pricing, CTA, footer |
| Free pricing messaging | `components/landing/Pricing.tsx` | **Functional** | Matches `PLATFORM_IS_FREE` |
| Brand directory | `/brands` | **Functional** | Fetches `GET /api/brands`; search; links to `/{slug}` |
| Reserved slugs | `lib/slug.ts`, backend slug utils | **Functional** | Prevents collision with `/admin`, `/dashboard`, etc. |

---

## 2. Authentication & session

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Sign up | `/signup` → `POST /api/auth/signup` | **Functional** | Creates user + brand; returns JWT; auto sign-in |
| Slug availability | `GET /api/auth/check-availability` | **Functional** | Live preview on signup |
| Login | `/login` → `POST /api/auth/login` | **Functional** | JWT stored in `localStorage` (`polowo_token`) |
| Post-login redirect | `lib/admin-emails.ts` | **Functional** | Admins → `/admin`; others → `/dashboard` (requires `NEXT_PUBLIC_ADMIN_EMAILS`) |
| Current user | `GET /api/auth/me` | **Functional** | Used by dashboard/admin layouts |
| Session protection | Dashboard/admin layouts | **Partial** | Client-side `useEffect` gate; no Next.js middleware |
| Forgot password | `/forgot-password` → `POST /api/auth/forgot-password` | **Functional** | Backend sends Resend email when configured |
| Reset password | `/reset-password` → `POST /api/auth/reset-password` | **Functional** | Token + email from reset link query params |
| Signup rate limiting | — | **Not implemented** | — |

---

## 3. Merchant dashboard

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Dashboard shell | `/dashboard/*` | **Functional** | Sidebar, mobile nav, brand context via `GET /api/auth/me` |
| Overview | `/dashboard` | **Functional** | Product counts, store link copy/visit |
| Checkout setup banner | Dashboard layout | **Functional** | Until WhatsApp or bank account is set (`lib/checkout-contact.ts`) |
| Free platform banner | Dashboard layout | **Functional** | Reflects `PLATFORM_IS_FREE` |
| Products — CRUD | `/dashboard/products` | **Functional** | Via `/api/dashboard/products` |
| Product images | `ImageUploader`, Cloudinary | **Functional** | Signed upload from backend; direct browser upload to Cloudinary |
| Stock tracking | Product form | **Functional** | Quantity ≥ 0 or `-1` unlimited; cart enforces limits client-side |
| Orders | `/dashboard/orders` | **Functional** | List + status updates via `/api/dashboard/orders` |
| Settings | `/dashboard/settings` | **Functional** | Brand profile, slug, theme, checkout contact, bank details |
| Instagram / Telegram | Settings | **Partial** | Saved via API; not shown on storefront |
| Store preview | `/dashboard/preview` | **Functional** | iframe + open `/{slug}` |
| Merchant analytics | `/dashboard/analytics` | **Functional** | 30-day visits, WhatsApp/transfer clicks, conversion % |
| Daily visit chart | Analytics page | **Partial** | API returns `dailyVisits`; not rendered in UI |
| Legacy renew | `/dashboard/renew` | **Dormant** | Redirects to `/dashboard` |

---

## 4. Public storefront

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Store page | `/{slug}` | **Functional** | SSR fetch `GET /api/storefront/:slug` |
| Product grid & modal | `StorefrontContent`, `ProductModal` | **Functional** | Search, theme from brand settings |
| Cart | `stores/cart.ts`, `Cart.tsx` | **Functional** | localStorage (`polowo-cart-v2`); scoped by brand |
| Stock limits in cart | `lib/stock.ts` | **Functional** | Client-side caps |
| Checkout — WhatsApp | `Cart.tsx` | **Functional** | Logs order, opens WhatsApp with message |
| Checkout — bank transfer | `Cart.tsx` | **Functional** | Shows account details; receipt via WhatsApp |
| Checkout gating | `Cart.tsx` | **Functional** | Blocked if merchant has no WhatsApp or account number |
| Order logging | `POST /api/orders` | **Functional** | Public API; no stock decrement |
| Event analytics | `POST /api/analytics/events` | **Functional** | page_view, product_click, whatsapp_click, transfer_click |
| Flagged / expired store | `app/[slug]/page.tsx` | **Functional** | Unavailable message |
| Paystack checkout | — | **Not implemented** | Backend routes exist; storefront does not call them |
| Instagram / Telegram on store | — | **Not implemented** | — |

---

## 5. Admin panel

| Feature | Route / location | Status | Notes |
|---------|------------------|--------|-------|
| Admin access | `app/admin/layout.tsx` | **Partial** | Client gate via `NEXT_PUBLIC_ADMIN_EMAILS`; API enforces `ADMIN_EMAILS` |
| Admin overview | `/admin` | **Partial** | Brand/product counts; MRR uses legacy paid-plan math |
| Brands management | `/admin/brands` | **Functional** | Plan, status, verify, flag, delete via `/api/admin/*` |
| Moderation queue | `/admin/moderation` | **Functional** | Flagged brands |
| Growth analytics | `/admin/growth` | **Not implemented** | “Coming Soon” placeholder |

---

## 6. Frontend API usage

The frontend never talks to PostgreSQL directly. All data flows through Express:

| Endpoint | Used by | Auth |
|----------|---------|------|
| `POST /api/auth/signup`, `/login`, `/me` | Auth flows | Bearer JWT |
| `GET /api/auth/check-availability` | Signup | Public |
| `POST /api/auth/forgot-password`, `/reset-password` | Password reset | Public |
| `GET /api/storefront/:slug`, `/api/brands` | Storefront, directory | Public |
| `POST /api/orders` | Cart checkout | Public |
| `POST /api/analytics/events` | Storefront tracking | Public |
| `GET /api/analytics/stats` | Dashboard analytics | Bearer JWT |
| `/api/dashboard/*` | Products, settings, uploads | Bearer JWT |
| `/api/admin/*` | Admin pages | Bearer JWT + admin email |

Rewrites: `frontend/next.config.ts` proxies browser `/api/*` to `NEXT_PUBLIC_API_URL`.

---

## 7. Payments & platform billing

| Feature | Status | Notes |
|---------|--------|-------|
| Free platform mode | **Functional** | `PLATFORM_IS_FREE = true`; no paywall UI |
| Paystack (backend) | **Dormant** | Initialize / verify / webhook implemented on server; not used by frontend |
| Merchant subscription UI | **Dormant** | Settings show free plan only |

---

## 8. File uploads

| Feature | Status | Notes |
|---------|--------|-------|
| Product images | **Functional** | Cloudinary signed upload (`/api/dashboard/uploads/signature`) |
| Brand logo | **Functional** | Same Cloudinary flow |
| Image domains | **Functional** | `next.config.ts` allows remote HTTPS images |

---

## 9. Security notes (frontend)

| Topic | Status | Notes |
|-------|--------|-------|
| JWT in localStorage | **Partial** | Standard SPA pattern; XSS-sensitive |
| Route protection | **Partial** | Client-side only in layouts; unauthenticated users may flash protected pages |
| Admin email allowlist | **Partial** | UI uses `NEXT_PUBLIC_ADMIN_EMAILS`; must match backend `ADMIN_EMAILS` |
| Public order/analytics writes | **Partial** | No rate limiting on frontend; backend accepts public POSTs |

---

## 10. Environment (frontend)

Copy `frontend/.env.example` to `frontend/.env.local`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Recommended | App base URL |
| `NEXT_PUBLIC_API_URL` | Required for SSR | Backend origin for server components |
| `NEXT_PUBLIC_ADMIN_EMAILS` | For admin UI | Comma-separated; must match backend `ADMIN_EMAILS` |

Backend variables (database, JWT, Cloudinary, Resend, Paystack) are configured in `backend/.env` — see root `README.md`.

---

## 11. User journeys

### Works today

1. **New merchant:** `/signup` → dashboard → add products → set WhatsApp or bank → share `/{slug}`
2. **Customer:** Storefront → cart → WhatsApp or bank checkout → order in merchant dashboard
3. **Merchant:** Manage orders, view analytics, customize theme and slug
4. **Admin:** Manage brands, flag/unflag, verify (when admin email is configured)

### Incomplete or inactive

1. Pay for platform plan — free; Paystack subscription flow unused
2. Customer Paystack checkout — not built in storefront
3. Instagram/Telegram on store — saved but not displayed
4. Automatic inventory deduction — cart UI only
5. Admin revenue/growth reporting — placeholders
6. Order email notifications — not implemented

---

## Related files

- Platform mode: `frontend/lib/platform.ts`
- Checkout requirements: `frontend/lib/checkout-contact.ts`
- API client: `frontend/lib/api.ts`, `frontend/lib/auth.ts`
- Admin allowlist (client): `frontend/lib/admin-emails.ts`
- Setup: root `README.md`, `frontend/.env.example`
