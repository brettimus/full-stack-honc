
# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## 📚 Onboarding

At the start of each session, read:
1. `README.md` - Project overview, tech stack, and quick start guide

If necessary, read/grep any `**/README.*.md` docs across the project for domain-specific context. Here are a few in the root:

- `README.SETUP.md` - Complete setup instructions and environment configuration
- `README.DEVELOPMENT.md` - Development commands, testing, code quality, and deployment
- `README.ARCHITECTURE.md` - Project structure, authentication system, and API reference

You can also search in the `agent-docs/` folder for additional context on using libraries in the project.

## ✅ Quality Gates

When writing code, you must not finish until all of these succeed:

1. `pnpm worker:test run` - All API tests pass
2. `pnpm format` - Code is properly formatted with Biome
3. `pnpm lint` - All linting rules pass
4. TypeScript compilation succeeds (no type errors)

If any check fails, fix the issues and run checks again.

## Coding Guidance

- Do not read the entirety of worker-configuration.d.ts. These files are large and blow up your context window. Instead grep them or read them piece by piece

- To run api tests in an environment similar to Cloudflare Workers, use "pnpm worker:test run"

- In vitest if you need to check if something is defined and you're then planning to check any further things there - use assert() call from vitest as opposed to expect(<thing>).toBeDefined(). This will prevent any type errors

- You should almost never add Cloudflare Bindings directly as a type. First see if they can be generated from the .dev.vars or the wrangler configuration file (using `pnpm cf-typegen`)

### TanStack Router Guidelines

- Use file-based routing: create new routes by adding `.tsx` files to `src/routes/`
- Follow TanStack Router file naming conventions for dynamic routes (`$param`), index routes, and layout routes
- The `routeTree.gen.ts` file is auto-generated - never edit it manually
- Use `createFileRoute()` for all route definitions
- Use the `Link` component for type-safe navigation
- Use route-specific hooks like `Route.useParams()` and `Route.useSearch()` for type safety
- For shared components, use `getRouteApi()` to access route-specific hooks without importing the route
