import type { TraceHeaders } from '@/lib/trace-headers';

export interface GenerateNameParams {
  readonly cookieId: string;
  readonly query?: string;
  readonly sessionId?: string;
  readonly turnsBetweenChatName?: number;
  readonly maxChatNameLength?: number;
  readonly maxChatNameWords?: number;
}

export interface GenerateNameResponse {
  readonly name: string;
  readonly session_id: string | null;
}

export interface BackendApiResult<T> {
  readonly data: T | null;
  readonly ok: boolean;
  readonly status: number;
  readonly traceHeaders: TraceHeaders;
}
