/**
 * Agent base class with Props type support
 *
 * The Props pattern allows passing initialization data to agents when they're created
 * or retrieved. This replaces the older "hydrate" pattern with a cleaner, type-safe API.
 *
 * @example
 * ```typescript
 * // Define your agent with typed props
 * interface MyAgentProps {
 *   userId: string;
 *   sessionId: string;
 *   serverUrl: string;
 * }
 *
 * class MyAgent extends BaseAgent<Env, MyState, MyAgentProps> {
 *   async onStart() {
 *     // Access props via this.ctx.props
 *     const { userId, sessionId } = this.ctx.props;
 *     console.log(`Agent started for user: ${userId}`);
 *   }
 * }
 * ```
 */

import { Agent } from 'agents';

/**
 * Common props passed to agents for authenticated context
 */
export interface AgentProps {
  /** The authenticated user's ID */
  userId: string;
  /** The current session ID */
  sessionId: string;
  /** The server URL for API callbacks */
  serverUrl: string;
}

/**
 * Environment bindings available to agents
 * Extends the base worker Env with agent-specific bindings
 */
export interface AgentEnv {
  DB: D1Database;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

/**
 * Base agent class with Props type support
 *
 * Extends the Cloudflare agents SDK Agent class with proper TypeScript generics
 * for environment, state, and props.
 *
 * @template Env - Environment bindings type (defaults to AgentEnv)
 * @template State - Internal state type managed by the agent
 * @template Props - Props type passed during agent initialization
 */
export abstract class BaseAgent<
  Env extends AgentEnv = AgentEnv,
  State = unknown,
  Props extends Record<string, unknown> = AgentProps,
> extends Agent<Env, State, Props> {
  /**
   * Called when the agent starts (either fresh or after hibernation)
   *
   * Access initialization props via `this.ctx.props`:
   * ```typescript
   * async onStart() {
   *   const { userId, sessionId, serverUrl } = this.ctx.props;
   *   // Initialize agent state based on props
   * }
   * ```
   *
   * Props are persisted to storage and available across agent restarts.
   * Use `this.ctx.props` to access current props at any time.
   */
  async onStart(): Promise<void> {
    // Override in subclass to handle agent initialization
    // Props are available via this.ctx.props
  }

  /**
   * Helper to get typed props
   * @returns The current props passed to the agent
   */
  protected getProps(): Props {
    return this.ctx.props;
  }

  /**
   * Check if required props are present
   * @param requiredKeys - Keys that must be present in props
   * @returns true if all required keys are present
   */
  protected hasRequiredProps(requiredKeys: (keyof Props)[]): boolean {
    const props = this.ctx.props;
    return requiredKeys.every(
      (key) => props[key] !== undefined && props[key] !== null
    );
  }
}

export type { Agent };
