import type { Session, SessionsResponse, AllSessionsResponse } from '@/types/chat';
import type { GenerateNameParams, GenerateNameResponse } from './chat.types';

export async function fetchSession(sessionId: string): Promise<Session | null> {
  try {
    const response = await fetch(`/api/chat/sessions/${sessionId}`, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch session:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

export async function fetchSessions(
  page: number = 1,
  pageSize: number = 50
): Promise<SessionsResponse | null> {
  try {
    const response = await fetch(`/api/chat/sessions?page=${page}&page_size=${pageSize}`, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });

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

export async function fetchAllSessions(): Promise<AllSessionsResponse | null> {
  try {
    const response = await fetch('/api/chat/sessions/all', {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch all sessions:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all sessions:', error);
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
        accept: 'application/json',
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
        accept: 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    return false;
  }
}

export async function generateSessionName(
  params: GenerateNameParams
): Promise<GenerateNameResponse | null> {
  try {
    const response = await fetch('/api/chat/sessions/generate-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.query,
        session_id: params.sessionId,
        turns_between_chat_name: params.turnsBetweenChatName,
        max_chat_name_length: params.maxChatNameLength,
        max_chat_name_words: params.maxChatNameWords,
      }),
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

export async function cancelChatGeneration(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/chat/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error cancelling chat generation:', error);
    return false;
  }
}
