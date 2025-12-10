# Campus Connect — Student Social Platform

Modern social platform for students built with Next.js 14 (App Router), Prisma, NextAuth, React Query, Tailwind (shadcn-ready), Framer Motion, UploadThing, and Pusher for realtime.

## Quick start
1) Install deps: `npm install`
2) Copy env template: `cp env.example .env` and fill in secrets.
3) Set `DATABASE_URL` to your Postgres instance (Neon/Supabase/local).
4) Generate Prisma client: `npm run postinstall` (or `npx prisma generate`).
5) Push schema: `npm run db:push`
6) Seed sample data: `npm run db:seed`
7) Start dev server: `npm run dev`

Open `http://localhost:3000`.

## Scripts
- `npm run dev` — start Next.js in dev
- `npm run build` / `npm start` — production build/serve
- `npm run lint` — eslint
- `npm run db:push` — sync schema to DB
- `npm run db:migrate` — create a named migration (local)
- `npm run db:seed` — seed sample users/posts/messages

## Environment
See `env.example` for required variables:
- `DATABASE_URL` (Postgres connection string)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`, `NEXT_PUBLIC_PUSHER_*`

## Database schema (Prisma)
Models include `User`, `Post` (media + tags + visibility), `Comment` (nested), `Like`, `Follow`, `Message`, `Notification`, plus NextAuth auth tables (`Account`, `Session`, `VerificationToken`).

## Tech highlights
- Next.js 14 App Router, React 18/19
- Tailwind CSS 3 + tailwindcss-animate, Inter font, glassmorphism-ready tokens
- Prisma with PostgreSQL (generator output in `src/generated/prisma`)
- Auth via NextAuth (email/password + Google OAuth)
- Realtime scaffolding with Pusher; uploads via UploadThing

## Maintenance notes
- Regenerate Prisma client after schema changes: `npx prisma generate`
- Create migrations for production: `npm run db:migrate`
- Rerun seeds safely with `npm run db:seed` (data is reset inside the script)
- Keep `.env` out of version control; use Vercel project envs for deploy.
