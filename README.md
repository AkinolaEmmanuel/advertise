# pòlówó

Hosted storefronts for Nigerian small businesses — merchant dashboard, public store at `/[slug]`, WhatsApp-first checkout.

## Local development

1. **Dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   You already have a `.env` locally; new clones should copy the template:

   ```bash
   cp .env.example .env
   ```

   Fill in Supabase keys from [Supabase](https://supabase.com) → Project Settings → API. Match variable names in `.env.example` (your existing `.env` is fine — no need to rename keys).

3. **Database**

   - Fresh project: run `supabase/schema.sql` in the Supabase SQL Editor.
   - Existing project: also run `supabase/migrations/20260530_tighten_public_writes.sql` so orders/analytics go through the API routes (not open client INSERT).

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Production deployment (e.g. Vercel)

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only; never expose to the client |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL, e.g. `https://yourdomain.com` |
| `ADMIN_EMAILS` | Yes for admin | Comma-separated; must match login email for `/admin` |
| `ENABLE_EMAIL` | No | `true` to send via Resend |
| `RESEND_API_KEY` | If email on | |
| `FROM_EMAIL` | If email on | Verified sender in Resend |
| `PAYSTACK_SECRET_KEY` | No | Platform is free; only if you re-enable Paystack |
| `ADMIN_SETUP_KEY` | No | Protects one-time admin setup API |

**Checklist**

1. Set all required env vars in the host dashboard (same names as `.env.example`).
2. Run the migration SQL on production Supabase if the DB predates the API write hardening.
3. `npm run build` must pass in CI or locally before deploy.
4. After deploy: sign up → add WhatsApp or account number in settings → place a test order on your storefront slug.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Stack

Next.js 16 (App Router), Supabase, Tailwind v4, Zustand cart, Resend (optional email).
