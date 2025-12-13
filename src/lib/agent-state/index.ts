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
 * - Shared Zod schemas for type-safe message handling
 *
 * @example
 * ```tsx
 * import {
 *   useAgentConnection,
 *   parseServerMessage,
 *   createClientMessage,
 *   type ServerMessage,
 * } from '@/lib/agent-state';
 *
 * function MyComponent() {
 *   const { socket, uiState } = useAgentConnection({
 *     agent: 'my-agent',
 *     onMessage: (event) => {
 *       const result = parseServerMessage(event.data);
 *       if (result.success) {
 *         const message = result.data;
 *         if (message.type === 'state:update') {
 *           // TypeScript knows message.data is StateUpdateData
 *           console.log(message.data.state);
 *         }
 *       }
 *     },
 *   });
 *
 *   const sendPing = () => {
 *     const message = createClientMessage('ping', { timestamp: Date.now() });
 *     socket.send(JSON.stringify(message));
 *   };
 *
 *   return (
 *     <div>
 *       <StatusBadge status={uiState} />
 *       <button onClick={sendPing}>Ping</button>
 *     </div>
 *   );
 * }
 * ```
 */

// Websocket message schemas (re-exported from worker for convenience)
export {
  type ClientMessage,
  type ConnectionStatusData,
  clientMessageSchema,
  connectionStatusDataSchema,
  createClientMessage,
  createServerMessage,
  type ErrorData,
  errorDataSchema,
  type PingData,
  parseClientMessage,
  // Utilities
  parseServerMessage,
  pingDataSchema,
  // Types
  type ServerMessage,
  type StateUpdateData,
  type SubscribeData,
  // Schemas
  serverMessageSchema,
  stateUpdateDataSchema,
  subscribeDataSchema,
  type UnsubscribeData,
  unsubscribeDataSchema,
} from '@/worker/schemas/websocket-messages';
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
