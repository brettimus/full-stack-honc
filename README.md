# Cloudflare Worker + React SPA with HONC Stack

This project combines a React SPA frontend with a powerful Cloudflare Worker API backend using the HONC stack (Hono + OpenAPI + NoSQL + Cloudflare).

## Architecture

### Frontend (React SPA)
- **React 19** with TypeScript
- **Vite** for development and build tooling
- **Biome** for code formatting and linting
- **SWC** for fast refresh during development

### Backend (Cloudflare Worker - HONC Stack)
- **Hono** - Ultra-fast web framework for the edge
- **OpenAPI** - Auto-generated API documentation with Swagger UI
- **D1 Database** - Serverless SQLite database 
- **Drizzle ORM** - TypeScript ORM with schema validation
- **Zod** - Runtime type validation and OpenAPI schema generation
- **Fiberplane** - API explorer and testing interface
- **Vitest** - Unit and integration testing with Cloudflare Workers pool
- **Biome** - Fast code formatting and linting

## Getting Started

### Installation
```bash
pnpm install
```

### Development

#### Frontend Development
```bash
pnpm dev  # Start React development server
```

#### Worker Development
```bash
pnpm worker:dev  # Start Cloudflare Worker development server
```

#### Database Setup
```bash
# Set up local D1 database with migrations and seed data
pnpm db:setup

# Individual database commands:
pnpm db:touch      # Create/verify database connection
pnpm db:generate   # Generate migrations from schema changes
pnpm db:migrate    # Apply migrations to local database
pnpm db:seed       # Seed database with sample data
pnpm db:studio     # Open Drizzle Studio (database GUI)
```

### Testing
```bash
pnpm worker:test       # Run worker tests once
pnpm worker:test:watch # Run worker tests in watch mode
```

### Code Quality
```bash
pnpm lint   # Lint and fix all code with Biome
pnpm format # Format all code with Biome
```

### Production Deployment

#### Database Setup for Production
Before deploying, set up a production D1 database:

1. **Create D1 database instance:**
   ```bash
   wrangler d1 create your-database-name
   ```

2. **Update `wrangler.jsonc`** with the production database ID:
   ```json
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "your-database-name", 
       "database_id": "your-production-database-id"
     }
   ]
   ```

3. **Create `.prod.vars` file** with production credentials:
   ```bash
   CLOUDFLARE_D1_TOKEN=your-api-token
   CLOUDFLARE_ACCOUNT_ID=your-account-id  
   CLOUDFLARE_DATABASE_ID=your-database-id
   ```

4. **Run production migrations:**
   ```bash
   pnpm db:generate        # Generate latest migration files
   pnpm db:migrate:prod    # Apply migrations to production
   pnpm db:seed:prod       # Seed production database (optional)
   ```

#### Deploy to Cloudflare
```bash
pnpm deploy  # Build and deploy both frontend and worker
```

## API Features

The worker provides a full-featured REST API with:

- **CRUD operations** for user management
- **OpenAPI specification** available at `/openapi.json`
- **Interactive API explorer** at `/fp` (Fiberplane)
- **Type-safe validation** using Zod schemas
- **Database integration** with Drizzle ORM and D1
- **Comprehensive error handling**

### API Endpoints

- `GET /` - Health check endpoint
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user by ID
- `GET /openapi.json` - OpenAPI specification
- `GET /fp/*` - Fiberplane API explorer

## Project Structure

```
├── src/                    # React SPA source code
├── worker/                 # Cloudflare Worker source code
│   ├── src/
│   │   ├── db/
│   │   │   └── schema.ts   # Drizzle database schema
│   │   ├── dtos/
│   │   │   └── index.ts    # Zod validation schemas
│   │   ├── middleware/
│   │   │   ├── dbProvider.ts    # Database connection middleware
│   │   │   └── validator.ts     # Request validation middleware
│   │   └── index.ts        # Main Hono application
│   ├── tests/              # Worker test files
│   ├── drizzle/           # Database utilities and migrations
│   ├── drizzle.config.ts  # Drizzle configuration
│   ├── vitest.config.ts   # Test configuration
│   └── seed.ts            # Database seeding script
├── wrangler.jsonc         # Cloudflare Worker configuration
├── biome.json             # Code formatting and linting configuration  
└── package.json           # Project dependencies and scripts
```

## Code Quality with Biome

This project uses [Biome](https://biomejs.dev/) for fast code formatting and linting across both frontend and backend code.

### Configuration

The `biome.json` configuration includes:

- **Unified formatting** for TypeScript, JavaScript, and JSON files
- **Import organization** with automatic sorting
- **React-specific linting** including accessibility rules
- **Consistent code style** with single quotes and ES5 trailing commas
- **Console logging** allowed in tests, seeds, and configuration files

### Usage

```bash
# Format all code
pnpm format

# Lint and auto-fix all code  
pnpm lint

# Check specific files
pnpm biome check src/

# Format specific files
pnpm biome format --write src/
```

### Key Features

- **Fast performance** - significantly faster than ESLint
- **Built-in formatter** - no need for separate Prettier
- **TypeScript-first** - excellent TypeScript support out of the box
- **Import organization** - automatically sorts and organizes imports
- **Accessibility checking** - built-in a11y rules for React components
