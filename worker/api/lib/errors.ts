/**
 * Serializes an unknown error for safe JSON logging.
 * Preserves key fields like name, message, stack, cause, and any enumerable properties.
 */
export function prepareErrorForLogging(error: unknown) {
  if (error instanceof Error) {
    const base: Record<string, unknown> = {};

    // Copy known error properties, if present
    if (
      'name' in error &&
      typeof (error as { name: unknown }).name === 'string'
    ) {
      base.name = (error as { name: string }).name;
    }

    if (
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      base.message = (error as { message: string }).message;
    }

    if (
      'stack' in error &&
      typeof (error as { stack: unknown }).stack === 'string'
    ) {
      base.stack = (error as { stack: string }).stack;
    }

    if ('cause' in error && error.cause !== undefined) {
      base.cause = prepareErrorForLogging(error.cause);
    }

    // Copy any other enumerable properties (excluding those already included)
    for (const [key, value] of Object.entries(error)) {
      if (
        key !== 'name' &&
        key !== 'message' &&
        key !== 'stack' &&
        key !== 'cause'
      ) {
        base[key] = value;
      }
    }

    return base;
  }

  // If it's a primitive value, just wrap it
  return error;
}
