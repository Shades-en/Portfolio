import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { serverConfig } from '@/config';

export const maxDuration = 60;

interface ChatStreamRequest {
  readonly query_message: {
    readonly query: string;
    readonly id?: string;
  };
  readonly user_cookie: string;
  readonly session_id?: string;
}

function sanitizeChatStreamBody(rawBody: unknown, cookieValue: string): ChatStreamRequest | null {
  if (!rawBody || typeof rawBody !== 'object') {
    return null;
  }

  const source = rawBody as Record<string, unknown>;
  const queryMessage = source.query_message;

  if (!queryMessage || typeof queryMessage !== 'object') {
    return null;
  }

  const query = (queryMessage as Record<string, unknown>).query;
  const messageId = (queryMessage as Record<string, unknown>).id;
  if (typeof query !== 'string' || query.trim().length === 0) {
    return null;
  }

  return {
    query_message: {
      query: query.trim(),
      ...(typeof messageId === 'string' && messageId ? { id: messageId } : {}),
    },
    user_cookie: cookieValue,
    ...(typeof source.session_id === 'string' && source.session_id
      ? { session_id: source.session_id }
      : {}),
  };
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await request.json();
    const body = sanitizeChatStreamBody(rawBody, userCookie.value);
    if (!body) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${serverConfig.backendApiUrl}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Backend request failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!response.body) {
      return new Response(JSON.stringify({ error: 'No response body' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'x-vercel-ai-ui-message-stream': 'v1',
      },
    });
  } catch (error) {
    console.error('Error in chat stream API route:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
