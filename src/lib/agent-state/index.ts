/**
 * Agent state management module
 *
 * Provides a simple state management pattern for agent/websocket connections,
 * based on nocturne's MCP server state handling approach.
 *
 * Key features:
 * - Simple global store using Map + Set listeners (no x-state)
 * - Derived UI state instead of complex state machines
 * - React integration via useSyncExternalStore
 * - Wraps agents SDK's useAgent hook
 *
 * @example
 * ```tsx
 * import { useAgentConnection } from '@/lib/agent-state';
 *
 * function MyComponent() {
 *   const { socket, uiState } = useAgentConnection({
 *     agent: 'my-agent',
 *     onMessage: (event) => handleMessage(event.data),
 *   });
 *
 *   return (
 *     <div>
 *       <StatusBadge status={uiState} />
 *       <button onClick={() => socket.send('hello')}>Send</button>
 *     </div>
 *   );
 * }
 * ```
 */

// Derived state
export { deriveUiState, getUiStateLabel } from './derive-ui-state';
// Store
export { agentStateStore } from './store';
// Types
export type {
  AgentConnectionState,
  AgentUiState,
} from './types';
export { initialConnectionState } from './types';

// Hook
export {
  type UseAgentConnectionOptions,
  type UseAgentConnectionResult,
  useAgentConnection,
} from './use-agent-connection';
