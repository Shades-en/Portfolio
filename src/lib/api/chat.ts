import type { SessionsResponse, MessagesResponse } from '@/types/chat';

export async function fetchSessions(
  page: number = 1,
  pageSize: number = 50
): Promise<SessionsResponse | null> {
  try {
    const response = await fetch(
      `/api/chat/sessions?page=${page}&page_size=${pageSize}`,
      {
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch sessions:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return null;
  }
}

export async function fetchMessages(
  sessionId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<MessagesResponse | null> {
  try {
    const response = await fetch(
      `/api/chat/sessions/${sessionId}/messages?page=${page}&page_size=${pageSize}`,
      {
        headers: {
          'accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch messages:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return null;
  }
}

export async function renameSession(sessionId: string, name: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/chat/sessions/${sessionId}/rename`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error renaming session:', error);
    return false;
  }
}

export async function toggleStarSession(sessionId: string, starred: boolean): Promise<boolean> {
  try {
    const response = await fetch(`/api/chat/sessions/${sessionId}/starred`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ starred }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error toggling star session:', error);
    return false;
  }
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/chat/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

export async function deleteAllSessions(): Promise<boolean> {
  try {
    const response = await fetch('/api/chat/sessions', {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    return false;
  }
}
