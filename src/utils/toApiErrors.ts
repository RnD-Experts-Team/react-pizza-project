// src/utils/toApiError.ts
import type { ApiError } from '../types/apiErrors';

export function toApiError(err: unknown): ApiError {
  const e = err as any;

  // Axios error with response
  if (e?.response) {
    const status = e.response.status;
    const data = e.response.data ?? {};
    return {
      message: data.message ?? 'Request failed',
      status,
      code: data.code ?? status,
      // Common (Laravel-style) validation errors
      fieldErrors: data.errors ?? data?.data?.errors,
    };
  }

  // Service layer sometimes returns plain objects with message
  if (e && typeof e === 'object' && 'message' in e) {
    return { message: (e as any).message };
  }

  // String or generic
  if (typeof err === 'string') return { message: err };
  return { message: e?.message ?? 'Network error' };
}
