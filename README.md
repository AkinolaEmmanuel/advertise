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
cp backend/.env.example backend/.env
```

Set `DATABASE_URL` and `JWT_SECRET` in `backend/.env`. PostgreSQL is expected to be provided externally.

Cloudinary image uploads are signed by the backend and uploaded directly from the browser. Add these to `backend/.env`:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Backend logs use colored levels and request timing. Set `LOG_LEVEL` in `backend/.env` to control verbosity:

```bash
LOG_LEVEL=info
```

Supported values are `debug`, `info`, `warn`, `error`, and `silent`. Set `NO_COLOR=1` to disable terminal colors.

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

Set the same required variables shown in `frontend/.env.example` and `backend/.env.example` on your host. At minimum, the backend needs a database URL and JWT secret; optional integrations such as Cloudinary, Resend, and Paystack require their respective keys.

Before deploying, run the frontend build and backend typecheck locally or in CI.

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
