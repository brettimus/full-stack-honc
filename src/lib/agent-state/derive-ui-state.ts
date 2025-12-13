/**
 * Derive UI state from raw connection state
 *
 * Instead of complex state machines, we compute the display state from raw data.
 * This is simpler to reason about and debug.
 */
import type { AgentConnectionState, AgentUiState } from './types';

/**
 * Derives the UI state from raw connection state
 *
 * The order of checks matters - more specific states should be checked first
 */
export function deriveUiState(state: AgentConnectionState): AgentUiState {
  // Error state takes precedence when there's an error and we're not connected
  if (state.error && !state.isConnected) {
    return 'error';
  }

  // Currently connected
  if (state.isConnected) {
    return 'connected';
  }

  // Reconnecting (connecting after a previous connection)
  if (state.isConnecting && state.reconnectAttempts > 0) {
    return 'reconnecting';
  }

  // Initial connection attempt
  if (state.isConnecting) {
    return 'connecting';
  }

  // Default - not connected and not trying to connect
  return 'disconnected';
}

/**
 * Get a human-readable label for a UI state
 */
export function getUiStateLabel(uiState: AgentUiState): string {
  switch (uiState) {
    case 'connected':
      return 'Connected';
    case 'connecting':
      return 'Connecting...';
    case 'reconnecting':
      return 'Reconnecting...';
    case 'error':
      return 'Connection Error';
    case 'disconnected':
      return 'Disconnected';
  }
}
