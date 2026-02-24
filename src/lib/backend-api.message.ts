import 'server-only';
import { serverConfig } from '@/config';
import type { MessagesResponse } from '@/types/chat';
import { pickTraceHeaders } from '@/lib/trace-headers';
import type { BackendApiResult } from './backend-api.types';

export async function callBackendMessages(
  sessionId: string,
  cookieId: string,
  page: number = 1,
  pageSize: number = 50,
): Promise<BackendApiResult<MessagesResponse>> {
  console.log('[backend-api] callBackendMessages invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}/messages?page=${page}&page_size=${pageSize}`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      if (response.status !== 404) {
        console.error('Failed to fetch messages from backend:', response.status);
      }
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as MessagesResponse,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error calling backend messages API:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function updateMessageFeedback(
  messageId: string,
  cookieId: string,
  feedback: 'liked' | 'disliked' | 'neutral',
): Promise<BackendApiResult<{ message_id: string; feedback: 'liked' | 'disliked' | 'neutral' }>> {
  console.log('[backend-api] updateMessageFeedback invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/messages/${messageId}/feedback`, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-cookie-id': cookieId,
      },
      body: JSON.stringify({ feedback }),
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to update message feedback:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as { message_id: string; feedback: 'liked' | 'disliked' | 'neutral' },
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error updating message feedback:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}
