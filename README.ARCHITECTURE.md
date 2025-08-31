# Architecture Guide

Overview of the project layout and main components.

## Project Structure

```
.
├── src/            # React SPA
├── worker/         # Cloudflare Worker backend
│   ├── src/        # API logic
│   ├── tests/      # API tests
│   └── drizzle/    # Database config and migrations
├── public/         # Static assets
├── README*.md      # Documentation
└── package.json    # Scripts and dependencies
```

## Frontend

`src/` contains the React app using TanStack Router. Authentication client code lives in `src/lib/auth.ts`.

## Backend

`worker/` runs on Cloudflare Workers with Hono. Key areas:

- `src/db/` – Drizzle schema and generated auth tables
- `src/middleware/` – auth and database middleware
- `src/dtos/` – Zod schemas and OpenAPI types
- `src/index.ts` – main Hono app and routes

## Authentication

Better Auth handles GitHub OAuth. Server configuration is in `worker/src/lib/auth.ts`; the client integrates via `src/lib/auth.ts`.

## API

Routes are defined in `worker/src/index.ts`. Zod schemas generate OpenAPI documentation served at `/openapi.json`.

