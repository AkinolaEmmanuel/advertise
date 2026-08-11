# polowo

Hosted storefronts for Nigerian small businesses: merchant dashboard, public store at `/[slug]`, and WhatsApp-first checkout.

This repository is split into two apps:

- `frontend/`: Next.js storefront, dashboard, and admin UI.
- `backend/`: Node.js, Express, Drizzle ORM, and PostgreSQL API.

The frontend stores a bearer token in local storage and calls the Express API through `/api/*` rewrites.

## Setup

Install dependencies for each app:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create environment files:

```bash
cp frontend/.env.example frontend/.env.local
```

Configure the backend separately (see `backend/` — database, JWT, Cloudinary, email, etc.).

## Database

Run the fresh PostgreSQL migration:

```bash
cd backend
npm run db:migrate
```

Seed a demo account:

```bash
cd backend
npm run seed
```

The seed user is `admin@polowo.live` with password `password123`.

## Development

Run backend and frontend in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies `/api/*` to `NEXT_PUBLIC_API_URL`, which defaults to `http://localhost:4000`.

## Production Deployment

Set variables from `frontend/.env.example` on the frontend host. Configure the backend with its own environment (database, JWT, Cloudinary, optional Resend and Paystack).

Before deploying, run the frontend build locally or in CI (`.github/workflows/frontend.yml`).

## Useful Scripts

```bash
cd frontend
npm run build
npm run lint

cd ../backend
npm run typecheck
npm run db:generate
npm run db:migrate
```

## Stack

Next.js 16 App Router, Express, PostgreSQL, Drizzle ORM, Tailwind v4, Zustand cart, Resend optional email, and Paystack optional payments.
