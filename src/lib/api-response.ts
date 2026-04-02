import { NextResponse } from "next/server";

import { logger } from "@/lib/observability/logger";
import { getOrCreateRequestId, setRequestIdHeader } from "@/lib/observability/request-id";

export interface ApiErrorBody {
  code: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorBody | null;
}

interface ResponseOptions {
  status?: number;
  requestId?: string;
  route?: string;
}

export function resolveRequestId(headers?: Headers, providedRequestId?: string): string {
  if (providedRequestId) {
    return providedRequestId;
  }

  return headers ? getOrCreateRequestId(headers) : crypto.randomUUID();
}

export function apiSuccess<T>(
  data: T,
  options: ResponseOptions = {}
): NextResponse<ApiEnvelope<T>> {
  const response = NextResponse.json<ApiEnvelope<T>>(
    {
      success: true,
      data,
      error: null
    },
    { status: options.status ?? 200 }
  );

  if (options.requestId) {
    setRequestIdHeader(response, options.requestId);
  }

  return response;
}

export function apiError(
  error: ApiErrorBody,
  options: ResponseOptions = {}
): NextResponse<ApiEnvelope<never>> {
  const status = options.status ?? 400;

  if (status >= 500) {
    logger.error("api:error", {
      requestId: options.requestId,
      route: options.route,
      code: error.code,
      message: error.message,
      status
    });
  } else {
    logger.warn("api:error", {
      requestId: options.requestId,
      route: options.route,
      code: error.code,
      message: error.message,
      status
    });
  }

  const response = NextResponse.json<ApiEnvelope<never>>(
    {
      success: false,
      data: null,
      error
    },
    { status }
  );

  if (options.requestId) {
    setRequestIdHeader(response, options.requestId);
  }

  return response;
}
