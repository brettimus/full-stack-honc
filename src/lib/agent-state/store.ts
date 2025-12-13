/**
 * Simple global store for agent connection state
 *
 * Based on nocturne's MCP server state pattern - a lightweight alternative to
 * state machines like x-state. Uses useSyncExternalStore for React integration.
 */
import { type AgentConnectionState, initialConnectionState } from './types';

type Listener = () => void;

/**
 * Creates a simple global store for managing agent connection states
 */
function createAgentStateStore() {
  const state = new Map<string, AgentConnectionState>();
  const listeners = new Set<Listener>();

  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    /**
     * Get the current state for an agent connection
     */
    getState(agentId: string): AgentConnectionState {
      return state.get(agentId) ?? initialConnectionState;
    },

    /**
     * Update the state for an agent connection
     */
    setState(agentId: string, newState: Partial<AgentConnectionState>): void {
      const currentState = state.get(agentId) ?? initialConnectionState;
      state.set(agentId, { ...currentState, ...newState });
      emitChange();
    },

    /**
     * Clear the state for an agent connection
     */
    clearState(agentId: string): void {
      state.delete(agentId);
      emitChange();
    },

    /**
     * Subscribe to state changes
     * @returns Unsubscribe function
     */
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    /**
     * Get all agent IDs currently in the store
     */
    getAgentIds(): string[] {
      return Array.from(state.keys());
    },
  };
}

/** Global store instance */
export const agentStateStore = createAgentStateStore();
