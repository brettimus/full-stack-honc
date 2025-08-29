# Claude Code Project Guide

## Project Overview

This is a full-stack web application that combines a React SPA frontend with a powerful Cloudflare Worker API backend using the HONC stack (Hono + OpenAPI + NoSQL + Cloudflare). The project demonstrates modern edge computing with serverless architecture, type-safe APIs, and comprehensive testing.

## Architecture

### Frontend (React SPA)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC for fast refresh
- **Styling**: CSS with dark theme and responsive design
- **State Management**: React hooks for local state
- **API Integration**: Type-safe client with error handling

### Backend (Cloudflare Worker - HONC Stack)
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Framework**: Hono - ultra-fast web framework for the edge
- **Database**: Cloudflare D1 (serverless SQLite)
- **ORM**: Drizzle ORM with type-safe schema
- **Validation**: Zod schemas with OpenAPI integration
- **API Documentation**: Auto-generated OpenAPI spec with Swagger UI
- **Testing**: Vitest with Cloudflare Workers pool
- **Code Quality**: Biome for formatting and linting

## Project Structure

```
hackday-cf-vite-setup/
├── src/                          # React SPA Frontend
│   ├── components/
│   │   ├── ApiStatus.tsx         # API health check component
│   │   ├── UserForm.tsx          # User creation form
│   │   └── UserList.tsx          # User display and management
│   ├── api.ts                    # Type-safe API client
│   ├── types.ts                  # TypeScript type definitions
│   ├── App.tsx                   # Main React application
│   ├── App.css                   # Application styles
│   ├── index.css                 # Global styles
│   └── main.tsx                  # React entry point
├── worker/                       # Cloudflare Worker Backend
│   ├── src/
│   │   ├── db/
│   │   │   └── schema.ts         # Drizzle database schema
│   │   ├── dtos/
│   │   │   └── index.ts          # Zod validation schemas
│   │   ├── middleware/
│   │   │   ├── dbProvider.ts     # D1 database middleware
│   │   │   └── validator.ts      # Request validation middleware
│   │   └── index.ts              # Main Hono application
│   ├── tests/
│   │   ├── env.d.ts              # Test environment types
│   │   ├── setup.ts              # Test database setup
│   │   └── index.spec.ts         # API endpoint tests
│   ├── drizzle/
│   │   ├── local.ts              # Local D1 database utilities
│   │   ├── remote.ts             # Remote database utilities
│   │   └── migrations/           # Database migration files
│   ├── drizzle.config.ts         # Drizzle ORM configuration
│   ├── vitest.config.ts          # Test configuration
│   ├── biome.json                # Code formatting rules
│   └── seed.ts                   # Database seeding script
├── wrangler.jsonc                # Cloudflare Worker configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Key Technologies

### Frontend Stack
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool with HMR
- **ESLint**: Code linting for quality

### Backend Stack
- **Hono**: High-performance web framework
- **Cloudflare D1**: Serverless SQLite database
- **Drizzle ORM**: Type-safe SQL operations
- **Zod**: Runtime validation and schema generation
- **hono-openapi**: OpenAPI specification generation
- **Fiberplane**: Interactive API explorer
- **Vitest**: Testing framework with Workers integration
- **Biome**: Fast code formatter and linter

## Development Workflow

### Getting Started
```bash
pnpm install                    # Install dependencies
pnpm db:setup                   # Set up local database
pnpm dev                        # Start frontend dev server
pnpm worker:dev                 # Start worker dev server (separate terminal)
```

### Database Operations
```bash
pnpm db:touch                   # Create/verify database connection
pnpm db:generate                # Generate migrations from schema changes
pnpm db:migrate                 # Apply migrations to local database
pnpm db:seed                    # Seed database with sample data
pnpm db:studio                  # Open Drizzle Studio (database GUI)
```

### Testing and Quality
```bash
pnpm worker:test                # Run API tests
pnpm worker:test:watch          # Run tests in watch mode
pnpm worker:lint                # Lint and fix worker code
pnpm worker:format              # Format worker code
```

### Production Deployment
```bash
pnpm deploy                     # Build and deploy to Cloudflare
```

## API Features

### REST Endpoints
- `GET /api/health` - Health check with database status
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

### Developer Tools
- `GET /openapi.json` - OpenAPI specification
- `GET /fp/*` - Fiberplane interactive API explorer

### Key Features
- **Type-safe validation** using Zod schemas
- **Comprehensive error handling** with structured responses
- **Database integration** with connection pooling
- **OpenAPI documentation** auto-generated from code
- **Interactive testing** via Fiberplane interface

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- UUID generated automatically
  name TEXT NOT NULL,            -- User's display name
  email TEXT NOT NULL,           -- User's email (unique, case-insensitive)
  created_at TEXT NOT NULL,      -- ISO timestamp
  updated_at TEXT NOT NULL       -- ISO timestamp
);

CREATE UNIQUE INDEX emailUniqueIndex ON users(LOWER(email));
```

### Schema Features
- **UUID Primary Keys**: Auto-generated using crypto.randomUUID()
- **Case-insensitive Email**: Unique index on lowercase email
- **Timestamps**: Automatic creation and update tracking
- **Type Safety**: Drizzle schema with TypeScript inference

## Configuration Files

### Key Configuration
- **`wrangler.jsonc`**: Cloudflare Worker deployment settings
  - D1 database binding configuration
  - Asset handling for SPA routing
  - Compatibility flags and date settings
- **`drizzle.config.ts`**: Database ORM configuration
  - Local and production database connections
  - Migration directory and schema location
- **`vitest.config.ts`**: Test configuration
  - Cloudflare Workers pool integration
  - D1 database testing setup
- **`biome.json`**: Code quality configuration
  - Formatting rules and linting settings

## Common Tasks

### Adding New API Endpoints
1. **Define schema** in `worker/src/db/schema.ts`
2. **Create DTOs** in `worker/src/dtos/index.ts`
3. **Add route** in `worker/src/index.ts` with OpenAPI docs
4. **Write tests** in `worker/tests/index.spec.ts`
5. **Update frontend** API client and components

### Database Changes
1. **Modify schema** in `worker/src/db/schema.ts`
2. **Generate migration**: `pnpm db:generate`
3. **Apply locally**: `pnpm db:migrate`
4. **Update seed data** in `worker/seed.ts` if needed
5. **Test changes**: `pnpm worker:test`

### Frontend Development
1. **Create components** in `src/components/`
2. **Update API client** in `src/api.ts`
3. **Add types** in `src/types.ts`
4. **Style components** in `src/App.css`
5. **Test in browser** with `pnpm dev`

## Deployment

### Production Setup
1. **Create D1 database**: `wrangler d1 create your-database-name`
2. **Update wrangler.jsonc** with production database ID
3. **Set environment variables** in `.prod.vars`
4. **Run migrations**: `pnpm db:migrate:prod`
5. **Deploy**: `pnpm deploy`

### Environment Variables
- **`CLOUDFLARE_D1_TOKEN`**: API token with D1 permissions
- **`CLOUDFLARE_ACCOUNT_ID`**: Cloudflare account identifier
- **`CLOUDFLARE_DATABASE_ID`**: Production database identifier

## Testing Strategy

### API Testing
- **Unit tests** for individual endpoints
- **Integration tests** with real D1 database
- **Error handling** validation
- **Type safety** verification

### Test Environment
- **Isolated databases** per test suite
- **Automatic migrations** applied before tests
- **Mock data** generation for consistent testing
- **CI/CD ready** with Vitest and Cloudflare integration

This project demonstrates modern full-stack development with edge computing, providing a solid foundation for scalable web applications on Cloudflare's platform.