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

## Agents

`worker/agent/` contains the Agent infrastructure for Cloudflare Durable Objects.

### Props Pattern

The Props pattern replaces the older "hydrate" method for passing initialization data to agents. Props provide a type-safe way to forward context (like authenticated user info) when creating or retrieving agent instances.

**Key concepts:**

- **Props** - Data passed to an agent when it's created or retrieved
- **onStart()** - Lifecycle method called when an agent starts, with props available via `this.ctx.props`
- **Storage persistence** - Props are automatically persisted to Durable Object storage

### Creating an Agent

```typescript
import { BaseAgent, type AgentEnv, type AgentProps } from '../agent';

interface MyState {
  messages: string[];
}

interface MyAgentProps extends AgentProps {
  customData?: string;
}

export class MyAgent extends BaseAgent<AgentEnv, MyState, MyAgentProps> {
  initialState: MyState = { messages: [] };

  async onStart() {
    const { userId, sessionId, serverUrl } = this.ctx.props;
    console.log(`Agent started for user: ${userId}`);
  }
}
```

### Routing Requests to Agents

Use the routing helpers to forward authenticated context:

```typescript
import { createAgentMiddleware } from './agent';

// Add to Hono app after auth middleware
app.all('/agents/*', createAgentMiddleware());
```

The middleware extracts user context from the authenticated request and forwards it as props.

### Wrangler Configuration

Each agent class needs a Durable Object binding in `wrangler.jsonc`:

```jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "MyAgent", "class_name": "MyAgent" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyAgent"] }]
}
```

After adding a new agent, run `pnpm cf-typegen` to regenerate types.

