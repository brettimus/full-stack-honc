/**
 * Hook for managing agent connections with state tracking
 *
 * Wraps the agents SDK's useAgent hook and integrates with our simple
 * state management store.
 */

import { type UseAgentOptions, useAgent } from 'agents/react';
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { deriveUiState } from './derive-ui-state';
import { agentStateStore } from './store';
import type { AgentConnectionState, AgentUiState } from './types';

export type UseAgentConnectionOptions<State = unknown> = Omit<
  UseAgentOptions<State>,
  'onOpen' | 'onClose' | 'onError'
> & {
  /** Called when connection opens (after state is updated) */
  onOpen?: () => void;
  /** Called when connection closes (after state is updated) */
  onClose?: (event: CloseEvent) => void;
  /** Called when an error occurs (after state is updated) */
  onError?: (event: Event) => void;
};

export type UseAgentConnectionResult<State = unknown> = {
  /** The underlying socket connection from useAgent */
  socket: ReturnType<typeof useAgent<State>>;
  /** Current connection state */
  connectionState: AgentConnectionState;
  /** Derived UI state for display */
  uiState: AgentUiState;
  /** Unique identifier for this connection */
  agentId: string;
};

/**
 * Creates a unique ID for an agent connection
 */
function createAgentId(agent: string, name?: string): string {
  return name ? `${agent}:${name}` : agent;
}

/**
 * Hook for connecting to an agent with integrated state management
 *
 * @example
 * ```tsx
 * const { socket, connectionState, uiState } = useAgentConnection({
 *   agent: 'my-agent',
 *   name: 'instance-1',
 *   onMessage: (event) => console.log(event.data),
 * });
 *
 * // Check connection status
 * if (uiState === 'connected') {
 *   socket.send(JSON.stringify({ type: 'hello' }));
 * }
 * ```
 */
export function useAgentConnection<State = unknown>(
  options: UseAgentConnectionOptions<State>
): UseAgentConnectionResult<State> {
  const { agent, name, onOpen, onClose, onError, ...restOptions } = options;

  const agentId = useMemo(() => createAgentId(agent, name), [agent, name]);

  // Get connection state using useSyncExternalStore
  const connectionState = useSyncExternalStore(
    agentStateStore.subscribe,
    () => agentStateStore.getState(agentId),
    () => agentStateStore.getState(agentId)
  );

  // Derive UI state from raw state
  const uiState = useMemo(
    () => deriveUiState(connectionState),
    [connectionState]
  );

  // Mark as connecting when the hook mounts
  useEffect(() => {
    agentStateStore.setState(agentId, {
      isConnecting: true,
    });

    return () => {
      // Clear state when unmounting
      agentStateStore.clearState(agentId);
    };
  }, [agentId]);

  // Wrapped event handlers that update state
  const handleOpen = useCallback(() => {
    agentStateStore.setState(agentId, {
      isConnected: true,
      isConnecting: false,
      error: null,
      connectedAt: Date.now(),
    });
    onOpen?.();
  }, [agentId, onOpen]);

  const handleClose = useCallback(
    (event: CloseEvent) => {
      const currentState = agentStateStore.getState(agentId);
      agentStateStore.setState(agentId, {
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: currentState.reconnectAttempts + 1,
        connectedAt: null,
      });
      onClose?.(event);
    },
    [agentId, onClose]
  );

  const handleError = useCallback(
    (event: Event) => {
      agentStateStore.setState(agentId, {
        error: new Error('WebSocket connection error'),
        isConnecting: false,
      });
      onError?.(event);
    },
    [agentId, onError]
  );

  // Use the agents SDK hook with our wrapped handlers
  const socket = useAgent<State>({
    agent,
    name,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    ...restOptions,
  });

  return {
    socket,
    connectionState,
    uiState,
    agentId,
  };
}
