# Cursor Setup Prompt — Concert Ticket Booking App

## Project Overview
Full-stack concert ticket booking app using **Next.js** (frontend) + **NestJS** (backend) + **PostgreSQL** (database via Docker).

---

## Prompt สำหรับวาง Cursor (Project Setup Only)

---

### ROLE & CONTEXT

You are a senior full-stack developer. Your task is to scaffold a **monorepo project** for a concert ticket booking application. Do NOT implement any business logic yet — only set up the project structure, configurations, and infrastructure.

---

### TECH STACK

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
| Migration | TypeORM migrations |

---

### MONOREPO STRUCTURE

Scaffold the following directory structure:

```
concert-app/
├── apps/
│   ├── frontend/          ← Next.js 14 App Router
│   └── backend/           ← NestJS
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

### TASK 1 — Root Level

Create the following files at the root:

**`docker-compose.yml`**
- Service: `postgres` using image `postgres:15-alpine`
- Environment: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` from `.env`
- Port: `5432:5432`
- Volume: named volume `pgdata` for persistence
- Service: `backend` (NestJS) — build from `apps/backend/Dockerfile`, port `3001:3001`, depends on postgres
- Service: `frontend` (Next.js) — build from `apps/frontend/Dockerfile`, port `3000:3000`, depends on backend
- All services on a shared network `concert-net`

**`.env.example`**
```env
# Database
POSTGRES_USER=concertuser
POSTGRES_PASSWORD=concertpass
POSTGRES_DB=concertdb
DATABASE_URL=postgresql://concertuser:concertpass@localhost:5432/concertdb

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# App
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:3000
```

**`.gitignore`**
- Standard Node.js ignores: `node_modules/`, `dist/`, `.env`, `.next/`, `coverage/`

---

### TASK 2 — Backend Setup (`apps/backend/`)

Bootstrap a **NestJS** app with the following:

**Install these packages:**
```
@nestjs/common @nestjs/core @nestjs/platform-express
@nestjs/config @nestjs/jwt @nestjs/passport
passport passport-jwt passport-local
@nestjs/typeorm typeorm pg
class-validator class-transformer
bcrypt
@nestjs/swagger swagger-ui-express
rxjs reflect-metadata
```

**Dev dependencies:**
```
@types/bcrypt @types/passport-jwt @types/passport-local
typescript ts-node ts-jest @nestjs/testing
jest supertest @types/supertest
```

**Directory structure inside `apps/backend/src/`:**
```
src/
├── main.ts
├── app.module.ts
├── config/
│   └── database.config.ts
├── auth/              ← empty module (scaffold only)
├── users/             ← empty module (scaffold only)
├── concerts/          ← empty module (scaffold only)
├── reservations/      ← empty module (scaffold only)
└── common/
    ├── decorators/
    ├── guards/
    └── enums/
        └── role.enum.ts
```

**`src/main.ts`** — bootstrap with:
- `ValidationPipe` globally (whitelist: true, forbidNonWhitelisted: true, transform: true)
- CORS enabled for `FRONTEND_URL`
- Swagger setup at `/api/docs`
- Listen on `BACKEND_PORT` from env

**`src/app.module.ts`** — wire up:
- `ConfigModule.forRoot({ isGlobal: true })`
- `TypeOrmModule.forRootAsync()` using `database.config.ts`
- Import placeholder modules: AuthModule, UsersModule, ConcertsModule, ReservationsModule

**`src/config/database.config.ts`** — TypeORM config:
- type: postgres
- Read host/port/user/pass/db from ConfigService
- entities: `[__dirname + '/../**/*.entity{.ts,.js}']`
- migrations: `[__dirname + '/../migrations/*{.ts,.js}']`
- synchronize: `false` (always use migrations)
- logging: `true` in development

**`src/common/enums/role.enum.ts`**
```typescript
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
```

**`apps/backend/Dockerfile`**
```dockerfile
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
```

**`apps/backend/package.json`** scripts:
```json
{
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main",
  "build": "nest build",
  "typeorm": "typeorm-ts-node-commonjs",
  "migration:generate": "npm run typeorm migration:generate",
  "migration:run": "npm run typeorm migration:run -- -d src/config/database.config.ts",
  "migration:revert": "npm run typeorm migration:revert -- -d src/config/database.config.ts",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage"
}
```

---

### TASK 3 — Frontend Setup (`apps/frontend/`)

Bootstrap a **Next.js 14** app with App Router and the following:

**Install these packages:**
```
next react react-dom typescript
tailwindcss postcss autoprefixer
@types/react @types/node
axios
react-hook-form @hookform/resolvers zod
react-hot-toast
lucide-react
```

**Directory structure inside `apps/frontend/`:**
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          ← Landing page (placeholder)
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx  ← Placeholder
│   │   └── register/
│   │       └── page.tsx  ← Placeholder
│   ├── (admin)/
│   │   └── dashboard/
│   │       └── page.tsx  ← Placeholder
│   └── (user)/
│       └── concerts/
│           └── page.tsx  ← Placeholder
├── components/
│   └── ui/               ← Empty (for shared components)
├── lib/
│   ├── api.ts            ← Axios instance setup
│   └── auth.ts           ← Placeholder auth helpers
├── types/
│   └── index.ts          ← Shared TypeScript interfaces
└── middleware.ts          ← Route protection middleware (placeholder)
```

**`src/lib/api.ts`** — Axios instance:
- baseURL: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'`
- Request interceptor: attach `Authorization: Bearer <token>` from localStorage
- Response interceptor: handle 401 by clearing token and redirecting to `/login`

**`src/types/index.ts`** — Define these TypeScript interfaces:
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  concertId: string;
  concert?: Concert;
  user?: User;
  createdAt: string;
}
```

**`src/app/layout.tsx`** — Root layout with:
- `<Toaster />` from react-hot-toast
- Tailwind base styles
- Thai-friendly font (Noto Sans Thai or Inter as fallback)

**`apps/frontend/.env.local.example`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**`apps/frontend/Dockerfile`**
```dockerfile
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

---

### TASK 4 — Verify Setup

After scaffolding, ensure:

1. Running `docker-compose up` starts postgres and the app containers without errors
2. `cd apps/backend && npm run start:dev` connects to PostgreSQL and starts on port 3001
3. `cd apps/frontend && npm run dev` starts on port 3000
4. Swagger UI is accessible at `http://localhost:3001/api/docs`
5. The Next.js landing page at `http://localhost:3000` renders without errors

---

### CONSTRAINTS

- Do NOT implement any business logic (no auth endpoints, no concert CRUD, no reservation logic)
- Do NOT create any database entities or migrations yet
- Do NOT add any UI components beyond placeholders
- Keep all placeholder pages as minimal as possible (just a heading is fine)
- All TypeScript files must have zero `any` types
- All config values must come from environment variables — no hardcoded secrets

---

### DELIVERABLE

A fully working project scaffold where:
- `docker-compose up` boots the full stack
- Both apps start without TypeScript errors
- The folder structure is clean and matches the layout above
- A developer can immediately start implementing features without touching config

