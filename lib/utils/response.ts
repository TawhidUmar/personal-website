import type { ApiSuccess, ApiError, ApiResponse } from '@/types/api.types';

export function successResponse<T>(
  data: T,
  message?: string
): ApiSuccess<T> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function errorResponse(
  error: string,
  errors?: Record<string, string[]>,
  code?: string
): ApiError {
  return { success: false, error, ...(errors ? { errors } : {}), ...(code ? { code } : {}) };
}

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.success === true;
}

export function isApiError(res: ApiResponse): res is ApiError {
  return res.success === false;
}
