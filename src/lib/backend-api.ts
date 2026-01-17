import { cache } from 'react';
import 'server-only';
import { serverConfig } from '@/config';
import type { User, Session, SessionsResponse, MessagesResponse } from '@/types/chat';

export const callBackendUser = cache(async (cookieId: string): Promise<User | null> => {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/users?cookie_id=${encodeURIComponent(cookieId)}`,
      {
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error('Failed to fetch user from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend user API:', error);
    return null;
  }
});

export const callBackendSessions = cache(async (
  cookieId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<SessionsResponse | null> => {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions?cookie_id=${encodeURIComponent(cookieId)}&page=${page}&page_size=${pageSize}`,
      {
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

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

export const callBackendSession = cache(async (sessionId: string): Promise<Session | null> => {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions/${sessionId}`,
      {
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

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

export const callBackendMessages = cache(async (
  sessionId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<MessagesResponse | null> => {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions/${sessionId}/messages?page=${page}&page_size=${pageSize}`,
      {
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('Failed to fetch messages from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend messages API:', error);
    return null;
  }
});

export async function renameSession(sessionId: string, newName: string): Promise<Session | null> {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions/${sessionId}/name`,
      {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
        cache: 'no-store',
      }
    );

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

export async function toggleStarSession(sessionId: string, starred: boolean): Promise<{ session_updated: boolean; session_id: string; starred: boolean } | null> {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions/${sessionId}/starred`,
      {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ starred }),
        cache: 'no-store',
      }
    );

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

export async function deleteSession(sessionId: string): Promise<{ messages_deleted: number; summaries_deleted: number; session_deleted: boolean } | null> {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions/${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

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

export async function deleteAllSessions(userId: string): Promise<{ sessions_deleted: number; messages_deleted: number; summaries_deleted: number } | null> {
  try {
    const response = await fetch(
      `${serverConfig.backendApiUrl}/sessions?user_id=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

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
