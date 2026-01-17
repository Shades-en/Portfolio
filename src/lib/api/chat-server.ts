import { cookies } from 'next/headers';
import { callBackendUser, callBackendSessions, callBackendSession, callBackendMessages } from '@/lib/backend-api';
import type { User, Session, SessionsResponse, MessagesResponse } from '@/types/chat';

export async function fetchUserServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_cookie');

  if (!userCookie?.value) {
    return null;
  }

  const user = await callBackendUser(userCookie.value);
  
  if (!user) {
    return { cookie_id: userCookie.value };
  }
  
  return user;
}

export async function fetchSessionsServer(
  page: number = 1,
  pageSize: number = 50
): Promise<SessionsResponse | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_cookie');

  if (!userCookie?.value) {
    return null;
  }

  return callBackendSessions(userCookie.value, page, pageSize);
}

export async function fetchCurrentSessionServer(sessionId: string): Promise<Session | null> {
  return callBackendSession(sessionId);
}

export async function fetchMessagesServer(
  sessionId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<MessagesResponse | null> {
  return callBackendMessages(sessionId, page, pageSize);
}
