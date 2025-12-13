/**
 * Shared Zod schemas for websocket messages
 *
 * Provides both runtime validation and TypeScript types for messages
 * sent between frontend and backend over websocket connections.
 *
 * Usage:
 * - Frontend: import { serverMessageSchema, type ClientMessage } from '@/worker/schemas/websocket-messages';
 * - Backend: import { type ServerMessage, clientMessageSchema } from './schemas/websocket-messages';
 */

import { z } from 'zod';

// =============================================================================
// Server → Client Messages
// =============================================================================

/**
 * Connection status update from server
 */
export const connectionStatusDataSchema = z.object({
  connectionId: z.string(),
  connectedAt: z.number(),
});

export type ConnectionStatusData = z.infer<typeof connectionStatusDataSchema>;

/**
 * Generic state update from server
 */
export const stateUpdateDataSchema = z.object({
  state: z.unknown(),
  timestamp: z.number(),
});

export type StateUpdateData = z.infer<typeof stateUpdateDataSchema>;

/**
 * Error message from server
 */
export const errorDataSchema = z.object({
  code: z.string().optional(),
  message: z.string(),
  details: z.unknown().optional(),
});

export type ErrorData = z.infer<typeof errorDataSchema>;

/**
 * Discriminated union for all server → client messages
 */
export const serverMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('connection:status'),
    data: connectionStatusDataSchema,
  }),
  z.object({
    type: z.literal('state:update'),
    data: stateUpdateDataSchema,
  }),
  z.object({
    type: z.literal('error'),
    data: errorDataSchema,
  }),
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;

// =============================================================================
// Client → Server Messages
// =============================================================================

/**
 * Ping message for keep-alive
 */
export const pingDataSchema = z.object({
  timestamp: z.number().optional(),
});

export type PingData = z.infer<typeof pingDataSchema>;

/**
 * Subscribe to a topic/channel
 */
export const subscribeDataSchema = z.object({
  topic: z.string(),
});

export type SubscribeData = z.infer<typeof subscribeDataSchema>;

/**
 * Unsubscribe from a topic/channel
 */
export const unsubscribeDataSchema = z.object({
  topic: z.string(),
});

export type UnsubscribeData = z.infer<typeof unsubscribeDataSchema>;

/**
 * Discriminated union for all client → server messages
 */
export const clientMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('ping'),
    data: pingDataSchema.optional(),
  }),
  z.object({
    type: z.literal('subscribe'),
    data: subscribeDataSchema,
  }),
  z.object({
    type: z.literal('unsubscribe'),
    data: unsubscribeDataSchema,
  }),
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Parse and validate a server message
 */
export function parseServerMessage(
  data: string
):
  | { success: true; data: ServerMessage }
  | { success: false; error: z.ZodError } {
  try {
    const json = JSON.parse(data);
    const result = serverMessageSchema.safeParse(json);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Invalid JSON',
          path: [],
        },
      ]),
    };
  }
}

/**
 * Parse and validate a client message
 */
export function parseClientMessage(
  data: string
):
  | { success: true; data: ClientMessage }
  | { success: false; error: z.ZodError } {
  try {
    const json = JSON.parse(data);
    const result = clientMessageSchema.safeParse(json);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Invalid JSON',
          path: [],
        },
      ]),
    };
  }
}

/**
 * Create a typed server message (for backend use)
 */
export function createServerMessage<T extends ServerMessage['type']>(
  type: T,
  data: Extract<ServerMessage, { type: T }>['data']
): Extract<ServerMessage, { type: T }> {
  return { type, data } as Extract<ServerMessage, { type: T }>;
}

/**
 * Create a typed client message (for frontend use)
 */
export function createClientMessage<T extends ClientMessage['type']>(
  type: T,
  data?: Extract<ClientMessage, { type: T }> extends { data: infer D }
    ? D
    : never
): Extract<ClientMessage, { type: T }> {
  if (data !== undefined) {
    return { type, data } as Extract<ClientMessage, { type: T }>;
  }
  return { type } as Extract<ClientMessage, { type: T }>;
}
