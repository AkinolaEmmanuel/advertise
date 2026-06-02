# Advertise

This repository is split into two apps:

- `frontend/`: Next.js storefront, dashboard, and admin UI.
- `backend/`: Node.js, Express, Drizzle ORM, and PostgreSQL API.

The frontend no longer uses Supabase directly. It stores a bearer token in local storage and calls the Express API through `/api/*` rewrites.

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
