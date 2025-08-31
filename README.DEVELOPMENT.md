# Development Guide

Essentials for working on this project.

## Start

```bash
pnpm dev
```

## Package Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start Vite dev server for frontend and API |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm typecheck` | Type check all projects |
| `pnpm typecheck:src` | Type check frontend only |
| `pnpm typecheck:worker` | Type check worker only |
| `pnpm typecheck:worker-tests` | Type check worker tests |
| `pnpm lint` | Lint and fix files with Biome |
| `pnpm format` | Format files with Biome |
| `pnpm cf-typegen` | Generate Cloudflare bindings |
| `pnpm db:touch` | Verify database connection |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:migrate` | Apply migrations locally |
| `pnpm db:migrate:prod` | Apply migrations in production |
| `pnpm db:seed` | Seed local database |
| `pnpm db:seed:prod` | Seed production database |
| `pnpm db:setup` | Run touch, generate, migrate, and seed |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm auth:generate` | Generate Better Auth schema |
| `pnpm worker:test` | Run API tests once |
| `pnpm worker:test:watch` | Run API tests in watch mode |

## Testing

```bash
# Run tests once
pnpm worker:test

# Watch mode
pnpm worker:test:watch
```

## Code Quality

```bash
pnpm format
pnpm lint
pnpm typecheck
```

## Database

```bash
pnpm db:generate   # create migration
pnpm db:migrate    # apply migration locally
pnpm db:seed       # seed data
pnpm db:studio     # inspect database
```

