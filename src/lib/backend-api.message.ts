import { cache } from 'react';
import 'server-only';
import { serverConfig } from '@/config';
import type { MessagesResponse } from '@/types/chat';

export const callBackendMessages = cache(async (
  sessionId: string,
  cookieId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<MessagesResponse | null> => {
  console.log('[backend-api] callBackendMessages invoked');
  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/sessions/${sessionId}/messages?page=${page}&page_size=${pageSize}`, {
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
      console.error('Failed to fetch messages from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend messages API:', error);
    return null;
  }
});

export async function updateMessageFeedback(
  messageId: string,
  cookieId: string,
  feedback: 'liked' | 'disliked' | 'neutral'
): Promise<{ message_id: string; feedback: 'liked' | 'disliked' | 'neutral' } | null> {
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

    if (!response.ok) {
      console.error('Failed to update message feedback:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating message feedback:', error);
    return null;
  }
}
