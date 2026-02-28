type ProxyRouteParams = {
  path?: string[];
};

type ProxyContext = {
  params: Promise<ProxyRouteParams>;
};

const TARGET_HEADER = 'x-proxy-target';
const PROXY_ALLOWED_HOSTS_ENV = 'PROXY_ALLOWED_HOSTS';
const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:']);

const REQUEST_HEADERS_TO_SKIP = new Set([
  'accept-encoding',
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const RESPONSE_HEADERS_TO_SKIP = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function createErrorResponse(status: number, code: string, message: string): Response {
  return Response.json(
    {
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

function parseAllowedHosts(): Set<string> {
  const rawHosts = process.env[PROXY_ALLOWED_HOSTS_ENV];

  if (!rawHosts) {
    return new Set();
  }

  const hosts = rawHosts
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return new Set(hosts);
}

function shouldSkipRequestHeader(name: string): boolean {
  const normalizedName = name.toLowerCase();
  return (
    REQUEST_HEADERS_TO_SKIP.has(normalizedName) ||
    normalizedName === TARGET_HEADER ||
    normalizedName.startsWith('proxy-')
  );
}

function shouldSkipResponseHeader(name: string): boolean {
  const normalizedName = name.toLowerCase();
  return RESPONSE_HEADERS_TO_SKIP.has(normalizedName) || normalizedName.startsWith('proxy-');
}

function filterHeaders(sourceHeaders: Headers, shouldSkip: (name: string) => boolean): Headers {
  const filteredHeaders = new Headers();

  sourceHeaders.forEach((value, name) => {
    if (!shouldSkip(name)) {
      filteredHeaders.append(name, value);
    }
  });

  return filteredHeaders;
}

function buildUpstreamUrl(targetUrl: URL, pathSegments: string[], requestUrl: URL): URL {
  const upstreamUrl = new URL(targetUrl.toString());

  if (pathSegments.length > 0) {
    const basePath = upstreamUrl.pathname.replace(/\/+$/, '');
    const encodedPath = pathSegments.map((segment) => encodeURIComponent(segment)).join('/');
    upstreamUrl.pathname = `${basePath}/${encodedPath}`.replace(/\/{2,}/g, '/');
  }

  const mergedQueryParams = new URLSearchParams(upstreamUrl.search);
  const incomingKeys = new Set(Array.from(requestUrl.searchParams.keys()));

  incomingKeys.forEach((key) => mergedQueryParams.delete(key));
  requestUrl.searchParams.forEach((value, key) => {
    mergedQueryParams.append(key, value);
  });

  upstreamUrl.search = mergedQueryParams.toString();
  return upstreamUrl;
}

async function getRequestBody(request: Request): Promise<ArrayBuffer | undefined> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }

  const body = await request.arrayBuffer();
  return body.byteLength > 0 ? body : undefined;
}

async function handleProxy(request: Request, context: ProxyContext): Promise<Response> {
  const targetValue = request.headers.get(TARGET_HEADER);

  if (!targetValue) {
    return createErrorResponse(400, 'MISSING_TARGET', `Missing required "${TARGET_HEADER}" header.`);
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(targetValue);
  } catch {
    return createErrorResponse(400, 'INVALID_TARGET', 'Target URL is invalid.');
  }

  if (!SUPPORTED_PROTOCOLS.has(targetUrl.protocol)) {
    return createErrorResponse(400, 'UNSUPPORTED_PROTOCOL', 'Only HTTP and HTTPS target URLs are supported.');
  }

  const allowedHosts = parseAllowedHosts();

  if (allowedHosts.size === 0) {
    return createErrorResponse(
      500,
      'ALLOWLIST_NOT_CONFIGURED',
      `${PROXY_ALLOWED_HOSTS_ENV} must include at least one allowed hostname.`
    );
  }

  const targetHostname = targetUrl.hostname.toLowerCase();
  if (!allowedHosts.has(targetHostname)) {
    return createErrorResponse(403, 'HOST_NOT_ALLOWED', 'Target hostname is not allowed.');
  }

  const { path = [] } = await context.params;
  const requestUrl = new URL(request.url);
  const upstreamUrl = buildUpstreamUrl(targetUrl, path, requestUrl);

  const outgoingHeaders = filterHeaders(request.headers, shouldSkipRequestHeader);

  let upstreamResponse: Response;
  try {
    const requestBody = await getRequestBody(request);

    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: outgoingHeaders,
      body: requestBody,
      redirect: 'manual',
    });
  } catch (error) {
    console.error('Proxy upstream request failed:', error);
    return createErrorResponse(502, 'UPSTREAM_FETCH_FAILED', 'Failed to reach target upstream URL.');
  }

  const responseHeaders = filterHeaders(upstreamResponse.headers, shouldSkipResponseHeader);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}

export async function PUT(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}

export async function PATCH(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}

export async function HEAD(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}

export async function OPTIONS(request: Request, context: ProxyContext): Promise<Response> {
  return handleProxy(request, context);
}
