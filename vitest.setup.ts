import { WebSocket as NodeWebSocket } from 'ws';

// biome-ignore lint/suspicious/noExplicitAny: polyfill for WebSocket for testing
(globalThis as any).WebSocket = NodeWebSocket;

import * as matchers from '@testing-library/jest-dom/matchers';
// Add DOM environment setup
import { expect, vi } from 'vitest';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock requestAnimationFrame and cancelAnimationFrame
// @ts-expect-error - haven't cracked the "global" type yet when running with bun, might need a different workaround
global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));
