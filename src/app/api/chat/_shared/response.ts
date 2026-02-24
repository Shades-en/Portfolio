import { NextResponse } from 'next/server';
import type { TraceHeaders } from '@/lib/trace-headers';
import { applyTraceHeaders } from '@/lib/trace-headers';

export function jsonWithTrace<T>(
  body: T,
  init: ResponseInit | undefined,
  traceHeaders: TraceHeaders,
): NextResponse {
  const response = NextResponse.json(body, init);
  applyTraceHeaders(response.headers, traceHeaders);
  return response;
}
