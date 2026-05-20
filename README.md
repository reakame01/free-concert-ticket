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

2. Start the full stack with Docker:

```bash
docker-compose up
```

3. Or run services individually:

```bash
# Start PostgreSQL only
docker-compose up postgres -d

# Backend (port 3001)
cd apps/backend && npm install && npm run start:dev

# Frontend (port 3000)
cd apps/frontend && npm install && npm run dev
```

### URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |

## Development Scripts

### Backend (`apps/backend`)

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Build for production |
| `npm run migration:generate` | Generate a new migration |
| `npm run migration:run` | Run pending migrations |
| `npm run test` | Run Jest tests |

### Frontend (`apps/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run Vitest tests |
