export const TRACE_HEADER_KEYS = ['x-request-id', 'x-trace-id', 'traceparent'] as const;
const ACCESS_CONTROL_EXPOSE_HEADERS = 'Access-Control-Expose-Headers';

export type TraceHeaderName = (typeof TRACE_HEADER_KEYS)[number];
export type TraceHeaders = Partial<Record<TraceHeaderName, string>>;

function toNonEmptyString(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function forEachTraceHeader(visitor: (key: TraceHeaderName) => void): void {
  for (const key of TRACE_HEADER_KEYS) {
    visitor(key);
  }
}

function toHeaderValueSet(value: string | null): Set<string> {
  const values = value
    ?.split(',')
    .map((item) => toNonEmptyString(item))
    .filter((item): item is string => Boolean(item));

  return new Set(values ?? []);
}

export function pickTraceHeaders(source: Headers): TraceHeaders {
  const traceHeaders: TraceHeaders = {};

  forEachTraceHeader((key) => {
    const value = toNonEmptyString(source.get(key));
    if (value) {
      traceHeaders[key] = value;
    }
  });

  return traceHeaders;
}

export function applyTraceHeaders(target: Headers, traceHeaders: TraceHeaders): void {
  forEachTraceHeader((key) => {
    const value = toNonEmptyString(traceHeaders[key]);
    if (value) {
      target.set(key, value);
    }
  });
}

export function withExposedTraceHeaders(target: Headers): void {
  const current = toHeaderValueSet(target.get(ACCESS_CONTROL_EXPOSE_HEADERS));

  forEachTraceHeader((key) => {
    current.add(key);
  });

  target.set(ACCESS_CONTROL_EXPOSE_HEADERS, Array.from(current).join(', '));
}
