# Backend (TypeScript + Express)

## Setup
- Copy `.env.example` to `.env` and adjust values if needed (including `JWT_SECRET`).
- Install deps: `npm install`

## Run
- Dev: `npm run dev`
- Build: `npm run build`
- Start (after build): `npm start`

# Backend

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Ensure the database has the `users` table from `db/tables/users.sql` (or run `db/tables/create-tables.sh`).

## Scripts

- `npm run dev` - Run the API in watch mode.
- `npm run build` - Compile to `dist/`.
- `npm start` - Run the compiled API.

## Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (requires `Authorization: Bearer <token>`)

