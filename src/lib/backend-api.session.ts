import { cache } from 'react';
import 'server-only';
import { serverConfig, chatConfig } from '@/config';
import type { Session, SessionsResponse, AllSessionsResponse } from '@/types/chat';
import type { GenerateNameParams, GenerateNameResponse } from './backend-api.types';

export const callBackendSessions = cache(async (
  cookieId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<SessionsResponse | null> => {
  console.log('[backend-api] callBackendSessions invoked');
  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions?page=${page}&page_size=${pageSize}`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch sessions from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend sessions API:', error);
    return null;
  }
});

export const callBackendAllSessions = cache(async (cookieId: string): Promise<AllSessionsResponse | null> => {
  console.log('[backend-api] callBackendAllSessions invoked');
  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/all`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch all sessions from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend all sessions API:', error);
    return null;
  }
});

export const callBackendSession = cache(async (sessionId: string, cookieId: string): Promise<Session | null> => {
  console.log('[backend-api] callBackendSession invoked');
  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('Failed to fetch session from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend session API:', error);
    return null;
  }
});

export async function renameSession(sessionId: string, cookieId: string, newName: string): Promise<Session | null> {
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

    if (!response.ok) {
      console.error('Failed to rename session:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error renaming session:', error);
    return null;
  }
}

export async function toggleStarSession(
  sessionId: string,
  cookieId: string,
  starred: boolean
): Promise<{ session_updated: boolean; session_id: string; starred: boolean } | null> {
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

    if (!response.ok) {
      console.error('Failed to toggle star session:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling star session:', error);
    return null;
  }
}

export async function deleteSession(
  sessionId: string,
  cookieId: string
): Promise<{ messages_deleted: number; summaries_deleted: number; session_deleted: boolean } | null> {
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

    if (!response.ok) {
      console.error('Failed to delete session:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting session:', error);
    return null;
  }
}

export async function deleteAllSessions(
  cookieId: string
): Promise<{ sessions_deleted: number; messages_deleted: number; summaries_deleted: number } | null> {
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

    if (!response.ok) {
      console.error('Failed to delete all sessions:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    return null;
  }
}

export async function generateSessionName(params: GenerateNameParams): Promise<GenerateNameResponse | null> {
  console.log('[backend-api] generateSessionName invoked');
  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/generate-name`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-cookie-id': params.cookieId,
      },
      body: JSON.stringify({
        query: params.query,
        session_id: params.sessionId,
        provider_options: {
          api_type: chatConfig.nameGeneration.apiType,
        },
        turns_between_chat_name: params.turnsBetweenChatName ?? 20,
        max_chat_name_length: params.maxChatNameLength ?? 50,
        max_chat_name_words: params.maxChatNameWords ?? 5,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to generate session name:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating session name:', error);
    return null;
  }
}

export async function cancelChatGeneration(sessionId: string): Promise<{ cancelled: boolean } | null> {
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

    if (!response.ok) {
      console.error('Failed to cancel chat generation:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling chat generation:', error);
    return null;
  }
}
