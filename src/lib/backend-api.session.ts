import 'server-only';
import { serverConfig } from '@/config';
import type { Session, SessionsResponse, AllSessionsResponse } from '@/types/chat';
import { pickTraceHeaders } from '@/lib/trace-headers';
import type { BackendApiResult, GenerateNameParams, GenerateNameResponse } from './backend-api.types';

export async function callBackendSessions(
  cookieId: string,
  page: number = 1,
  pageSize: number = 50,
): Promise<BackendApiResult<SessionsResponse>> {
  console.log('[backend-api] callBackendSessions invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions?page=${page}&page_size=${pageSize}`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to fetch sessions from backend:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as SessionsResponse,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error calling backend sessions API:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function callBackendAllSessions(cookieId: string): Promise<BackendApiResult<AllSessionsResponse>> {
  console.log('[backend-api] callBackendAllSessions invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/all`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to fetch all sessions from backend:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as AllSessionsResponse,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error calling backend all sessions API:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function callBackendSession(sessionId: string, cookieId: string): Promise<BackendApiResult<Session>> {
  console.log('[backend-api] callBackendSession invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      if (response.status !== 404) {
        console.error('Failed to fetch session from backend:', response.status);
      }
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as Session,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error calling backend session API:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function renameSession(
  sessionId: string,
  cookieId: string,
  newName: string,
): Promise<BackendApiResult<Session>> {
  console.log('[backend-api] renameSession invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}/name`, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-cookie-id': cookieId,
      },
      body: JSON.stringify({ name: newName }),
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to rename session:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as Session,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error renaming session:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function toggleStarSession(
  sessionId: string,
  cookieId: string,
  starred: boolean,
): Promise<BackendApiResult<{ session_updated: boolean; session_id: string; starred: boolean }>> {
  console.log('[backend-api] toggleStarSession invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}/starred`, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-cookie-id': cookieId,
      },
      body: JSON.stringify({ starred }),
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to toggle star session:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as { session_updated: boolean; session_id: string; starred: boolean },
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error toggling star session:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function deleteSession(
  sessionId: string,
  cookieId: string,
): Promise<BackendApiResult<{ messages_deleted: number; summaries_deleted: number; session_deleted: boolean }>> {
  console.log('[backend-api] deleteSession invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to delete session:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as { messages_deleted: number; summaries_deleted: number; session_deleted: boolean },
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error deleting session:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function deleteAllSessions(
  cookieId: string,
): Promise<BackendApiResult<{ sessions_deleted: number; messages_deleted: number; summaries_deleted: number }>> {
  console.log('[backend-api] deleteAllSessions invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to delete all sessions:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as { sessions_deleted: number; messages_deleted: number; summaries_deleted: number },
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function generateSessionName(
  params: GenerateNameParams,
): Promise<BackendApiResult<GenerateNameResponse>> {
  console.log('[backend-api] generateSessionName invoked');

  try {
    const trimmedQuery = params.query?.trim();
    if (!params.sessionId && !trimmedQuery) {
      console.error('Invalid generateSessionName request: query is required when sessionId is missing');
      return {
        data: null,
        ok: false,
        status: 400,
        traceHeaders: {},
      };
    }

    const payload = {
      query: trimmedQuery,
      session_id: params.sessionId,
      turns_between_chat_name: params.turnsBetweenChatName ?? 20,
      max_chat_name_length: params.maxChatNameLength ?? 50,
      max_chat_name_words: params.maxChatNameWords ?? 5,
    };

    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/generate-name`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-cookie-id': params.cookieId,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to generate session name:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as GenerateNameResponse,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error generating session name:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}

export async function cancelChatGeneration(
  sessionId: string,
): Promise<BackendApiResult<{ cancelled: boolean }>> {
  console.log('[backend-api] cancelChatGeneration invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/chat/cancel`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      console.error('Failed to cancel chat generation:', response.status);
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as { cancelled: boolean },
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error cancelling chat generation:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}
