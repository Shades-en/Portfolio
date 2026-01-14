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
