# Concert Ticket Booking App

Full-stack concert ticket booking application using **Next.js** (frontend) + **NestJS** (backend) + **PostgreSQL** (database via Docker).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL 15 (via Docker) |
| ORM | TypeORM |
| Auth | JWT (via @nestjs/jwt, passport) |
| Validation | class-validator + class-transformer |
| Testing | Jest (backend), Vitest (frontend) |
| Container | Docker + Docker Compose |

## Project Structure

```
├── apps/
│   ├── frontend/          ← Next.js 14 App Router
│   └── backend/           ← NestJS
├── package.json           ← root scripts (dev ทั้ง FE + BE)
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Setup

1. Copy environment variables:

```bash
cp .env.example .env
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

2. Install dependencies (ครั้งแรก):

```bash
npm install
npm run install:all
```

3. **Dev แบบเร็ว (แนะนำ)** — รัน FE + BE พร้อมกันที่ root:

```bash
npm run dev:full
```

หรือแยกขั้นตอน:

```bash
npm run dev:db    # PostgreSQL เท่านั้น
npm run dev       # Frontend :3000 + Backend :3001
```

4. หรือใช้ Docker ทั้ง stack:

```bash
docker-compose up
```

5. หรือรันแยกโฟลเดอร์ (debug ทีละส่วน):

```bash
cd apps/backend && npm run start:dev
cd apps/frontend && npm run dev
```

### URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |

## Development Scripts

### Root (รันที่โฟลเดอร์โปรเจกต์)

| Command | Description |
|---|---|
| `npm run dev` | Frontend + Backend พร้อมกัน |
| `npm run dev:db` | Start PostgreSQL (Docker) |
| `npm run dev:full` | DB + Frontend + Backend |
| `npm run install:all` | `npm install` ใน frontend และ backend |
| `npm run build` | Build ทั้งสอง apps |
| `npm run docker:up` | `docker-compose up` |

### Backend (`apps/backend`)

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Build for production |
| `npm run migration:run` | Run pending migrations (required before first API use) |
| `npm run migration:generate` | Generate a new migration |
| `npm run test` | Run Jest tests |

**First-time DB setup** (with Postgres running via `npm run dev:db`):

```bash
cd apps/backend
npm run migration:run
```

Default admin seed: `admin` / `admin`

### Frontend (`apps/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run Vitest tests |
