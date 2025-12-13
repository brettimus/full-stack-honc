/**
 * Connection state types for agent websocket connections
 */

/**
 * Raw connection state - the actual data we track
 */
export type AgentConnectionState = {
  /** Whether the websocket is currently connected */
  isConnected: boolean;
  /** Whether we're currently attempting to connect */
  isConnecting: boolean;
  /** The last error that occurred, if any */
  error: Error | null;
  /** Timestamp of when the connection was established */
  connectedAt: number | null;
  /** Number of reconnection attempts */
  reconnectAttempts: number;
};

/**
 * Derived UI state - computed from raw state for display purposes
 */
export type AgentUiState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

/**
 * Initial state for a new connection
 */
export const initialConnectionState: AgentConnectionState = {
  isConnected: false,
  isConnecting: false,
  error: null,
  connectedAt: null,
  reconnectAttempts: 0,
};
