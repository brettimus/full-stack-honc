# Cloudflare Worker + React SPA with HONC Stack

This project combines a React SPA frontend with a powerful Cloudflare Worker API backend using the HONC stack (Hono + OpenAPI + NoSQL + Cloudflare).

## Architecture

### Frontend (React SPA)
- **React 19** with TypeScript
- **Vite** for development and build tooling
- **ESLint** for code linting
- **SWC** for fast refresh during development

### Backend (Cloudflare Worker - HONC Stack)
- **Hono** - Ultra-fast web framework for the edge
- **OpenAPI** - Auto-generated API documentation with Swagger UI
- **D1 Database** - Serverless SQLite database 
- **Drizzle ORM** - TypeScript ORM with schema validation
- **Zod** - Runtime type validation and OpenAPI schema generation
- **Fiberplane** - API explorer and testing interface
- **Vitest** - Unit and integration testing with Cloudflare Workers pool

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
pnpm worker:lint   # Lint and fix worker code with Biome
pnpm worker:format # Format worker code with Biome
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
│   ├── biome.json         # Code formatting configuration
│   └── seed.ts            # Database seeding script
├── wrangler.jsonc         # Cloudflare Worker configuration
└── package.json           # Project dependencies and scripts
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
