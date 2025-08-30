# Development Guide

Development workflow, commands, testing, and deployment for the HONC Stack template.

## Development Workflow

### Daily Development

```bash
# Start the entire app
pnpm dev # Vite dev server that reloads frontend + api (http://localhost:4284)
```

## Development Commands

### Core Commands

```bash
# Development servers
pnpm dev                    # Start Vite dev server that reloads frontend + api (http://localhost:4284)

# Database operations  
pnpm db:setup               # Complete database setup (touch + migrate + seed)
pnpm db:touch               # Create/verify database connection
pnpm db:generate            # Generate migrations from schema changes
pnpm db:migrate             # Apply migrations to local database
pnpm db:seed                # Seed database with sample data
pnpm db:studio              # Open Drizzle Studio (database GUI)

# Authentication
pnpm auth:generate          # Generate Better Auth database schema

# Testing
pnpm worker:test            # Run API tests once in miniflare
pnpm worker:test:watch      # Run API tests in watch mode in miniflare

# Code quality
pnpm format                 # Format all code with Biome
pnpm lint                   # Lint and auto-fix all code with Biome

# Build and deployment
pnpm build                  # Build frontend for production
pnpm deploy                 # Deploy to Cloudflare (frontend + worker)
```

### Package Management

```bash
# Install new dependencies
pnpm add <package>              # Add to frontend dependencies

# Remove dependencies
pnpm remove <package>           # Remove from frontend
```

## Testing

### API Testing with Vitest

```bash
# Run tests once
pnpm worker:test

# Run tests in watch mode (during development)
pnpm worker:test:watch

# Run specific test file
pnpm worker:test src/index.spec.ts

# Run tests with coverage
pnpm worker:test --coverage
```

### Test Structure

Tests are located in `worker/tests/` and use:
- **Vitest** - Fast test runner with Cloudflare Workers pool
- **Real D1 Database** - Tests run against actual database instances
- **Auto-migrations** - Fresh database for each test suite
- **Mock Data** - Consistent test fixtures

### Writing Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '../src'

describe('API Endpoints', () => {
  beforeEach(async () => {
    // Database is automatically reset between tests
  })

  it('should create user', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    expect(res.status).toBe(201)
    const user = await res.json()
    expect(user.name).toBe('Test User')
  })
})
```

## Code Quality with Biome

This project uses [Biome](https://biomejs.dev/) for ultra-fast code formatting and linting.

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

# Check specific files/directories
pnpm biome check src/
pnpm biome check worker/src/

# Format specific files
pnpm biome format --write src/
pnpm biome format --write worker/src/
```

### IDE Integration

**VS Code**: Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- Automatic formatting on save
- Real-time linting and error highlighting
- Import organization

**Other IDEs**: Check [Biome's editor integrations](https://biomejs.dev/guides/editors/first-party-extensions/)

### Key Benefits

- **Speed**: 35x faster than ESLint + Prettier
- **All-in-one**: Formatting + linting + import sorting
- **TypeScript-first**: Excellent TypeScript support
- **React support**: Built-in accessibility rules
- **Zero config**: Works out of the box

## Database Development

### Schema Changes

When modifying `worker/src/db/schema.ts`:

```bash
# 1. Generate migration
pnpm db:generate

# 2. Review the generated migration in worker/drizzle/migrations/

# 3. Apply migration locally
pnpm db:migrate

# 4. Update seed data if needed (worker/seed.ts)
pnpm db:seed
```

### Database Inspection

```bash
# Open Drizzle Studio - visual database browser
pnpm db:studio
```

Drizzle Studio provides:
- Visual table browser
- Query editor
- Data editing capabilities
- Relationship visualization

### Authentication Tables

Better Auth automatically manages these tables:
- `user` - User accounts and profiles
- `session` - Active user sessions  
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

**Don't manually modify auth tables** - use Better Auth configuration instead.

## Production Deployment

### Database Setup for Production

1. **Create production D1 database:**
   ```bash
   wrangler d1 create your-production-database-name
   ```

2. **Update `wrangler.jsonc`** with production database ID:
   ```json
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "your-production-database-name",
       "database_id": "your-production-database-id-from-step-1"
     }
   ]
   ```

3. **Set production environment variables** in Cloudflare dashboard:
   - `BETTER_AUTH_SECRET` - Secure random string (different from dev)
   - `BETTER_AUTH_URL` - Your production domain
   - `GITHUB_CLIENT_ID` - Production GitHub OAuth app ID  
   - `GITHUB_CLIENT_SECRET` - Production GitHub OAuth app secret

4. **Create production GitHub OAuth app** with production URLs:
   - Homepage URL: `https://your-domain.com`
   - Callback URL: `https://your-domain.com/api/auth/callback/github`

5. **Run production migrations:**
   ```bash
   # Generate auth schema for production
   pnpm auth:generate

   # Generate latest migrations
   pnpm db:generate

   # Apply to production database  
   pnpm db:migrate:prod
   ```

### Deploy to Cloudflare

```bash
# Build and deploy everything
pnpm deploy
```

This command:
1. Builds the React frontend for production
2. Deploys the Cloudflare Worker with the built frontend
3. Updates environment variables
4. Runs any pending migrations

### Production Checklist

Before deploying:
- [ ] Production D1 database created and configured
- [ ] Production GitHub OAuth app created
- [ ] Environment variables set in Cloudflare dashboard
- [ ] `wrangler.jsonc` updated with production database ID
- [ ] Migrations applied to production database
- [ ] Local build and tests passing (`pnpm build && pnpm worker:test`)

## Development Tips

### Debugging

**Worker Logs:**
```bash
# View worker logs in real-time
wrangler tail

# View logs for specific worker
wrangler tail --name your-worker-name
```

**Database Debugging:**
- Use `pnpm db:studio` to inspect database state
- Check migration files in `worker/drizzle/migrations/`
- Use `console.log()` in worker code (visible in `wrangler tail`)

### Performance

**Frontend:**
- Vite provides fast HMR and optimized builds
- React 19 includes automatic optimizations
- TypeScript compilation is fast with SWC

**Backend:**
- Hono is optimized for edge computing
- D1 provides low-latency database access
- Better Auth is designed for serverless environments

### Common Workflows

**Adding a new API endpoint:**
1. Define Zod schema in `worker/src/dtos/index.ts`
2. Add route in `worker/src/index.ts` with OpenAPI documentation
3. Write tests in `worker/tests/`
4. Update frontend API client if needed

**Adding a new database table:**
1. Update `worker/src/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:migrate` to apply locally
4. Update seed data in `worker/seed.ts`
5. Write tests for new functionality

**Updating authentication:**
1. Modify `better-auth.config.ts` or `worker/src/lib/auth.ts`
2. Run `pnpm auth:generate` to update auth tables
3. Run `pnpm db:migrate` to apply changes
4. Test authentication flow thoroughly
