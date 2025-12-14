/**
 * Agent routing utilities with props forwarding
 *
 * Wraps the agents SDK `routeAgentRequest` to integrate with Hono
 * middleware and forward authenticated user context as props.
 */

import { routeAgentRequest as baseRouteAgentRequest } from 'agents';
import type { Context } from 'hono';
import type { AgentEnv, AgentProps } from './base';

/**
 * Options for agent routing
 */
export interface AgentRoutingOptions {
  /** Whether to enable CORS for agent requests */
  cors?: boolean | HeadersInit;
  /** Custom props to pass to the agent (merged with default props) */
  customProps?: Partial<AgentProps>;
  /** Prefix for agent routes (default: '/agents') */
  prefix?: string;
}

/**
 * Extract user context from Hono context for agent props
 *
 * @param c - Hono context with authenticated user
 * @returns AgentProps with user context
 */
export function extractAgentProps(
  c: Context<{ Bindings: AgentEnv; Variables: { user: { id: string } } }>
): AgentProps {
  const user = c.get('user');
  const url = new URL(c.req.url);

  return {
    userId: user.id,
    sessionId: c.req.header('x-session-id') ?? '',
    serverUrl: `${url.protocol}//${url.host}`,
  };
}

/**
 * Route a request to an agent with props forwarding
 *
 * Wraps the agents SDK routeAgentRequest and forwards authenticated
 * user context as props to the agent.
 *
 * @example
 * ```typescript
 * // In your Hono app
 * app.all('/agents/*', async (c) => {
 *   const response = await routeAgentRequestWithProps(c);
 *   if (response) return response;
 *   return c.notFound();
 * });
 * ```
 *
 * @param c - Hono context
 * @param options - Routing options
 * @returns Response from the agent or null if no route matched
 */
export async function routeAgentRequestWithProps<
  Env extends AgentEnv = AgentEnv,
>(
  c: Context<{ Bindings: Env; Variables: { user: { id: string } } }>,
  options: AgentRoutingOptions = {}
): Promise<Response | null> {
  const { cors = true, customProps = {} } = options;

  // Extract props from authenticated context
  const baseProps = extractAgentProps(c);
  const props = { ...baseProps, ...customProps };

  // Route to agent with props
  return baseRouteAgentRequest(c.req.raw, c.env, {
    cors,
    props,
  });
}

/**
 * Create a Hono middleware for agent routing
 *
 * @example
 * ```typescript
 * import { createAgentMiddleware } from './agent/routing';
 *
 * app.all('/agents/*', createAgentMiddleware());
 * ```
 *
 * @param options - Routing options
 * @returns Hono middleware handler
 */
export function createAgentMiddleware<Env extends AgentEnv = AgentEnv>(
  options: AgentRoutingOptions = {}
) {
  return async (
    c: Context<{ Bindings: Env; Variables: { user: { id: string } } }>
  ) => {
    const response = await routeAgentRequestWithProps(c, options);

    if (response) {
      return response;
    }

    return c.notFound();
  };
}

// Re-export the base function for direct use if needed
export { baseRouteAgentRequest as routeAgentRequest };
