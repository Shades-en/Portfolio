import type { MessagesResponse } from '@/types/chat';

export async function fetchMessages(
  sessionId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<MessagesResponse | null> {
  try {
    const response = await fetch(`/api/chat/sessions/${sessionId}/messages?page=${page}&page_size=${pageSize}`, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });

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

export async function updateMessageFeedback(
  messageId: string,
  feedback: 'liked' | 'disliked' | 'neutral'
): Promise<boolean> {
  try {
    const response = await fetch(`/api/chat/messages/${messageId}/feedback`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating message feedback:', error);
    return false;
  }
}
