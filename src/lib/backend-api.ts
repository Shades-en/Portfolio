import { cache } from 'react';
import 'server-only';
import { serverConfig } from '@/config';
import type { User, SessionsResponse, MessagesResponse } from '@/types/chat';

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
      console.error('Failed to fetch messages from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend messages API:', error);
    return null;
  }
});
