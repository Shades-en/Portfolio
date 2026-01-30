import React from 'react';
import Chat from '@/components/chat/Chat';
import { fetchUserServer, fetchSessionsServer } from '@/lib/api/chat-server';
import type { User, SessionsResponse } from '@/types/chat';

export default async function ChatPage(): Promise<React.ReactElement> {
  const results = await Promise.allSettled([
    fetchUserServer(),
    fetchSessionsServer(1, 50),
  ]);

  let user: User | null = null;
  let sessionsData: SessionsResponse | null = null;

  if (results[0].status === 'fulfilled') {
    user = results[0].value;
  } else {
    console.error('Failed to fetch user:', results[0].reason);
  }

  if (results[1].status === 'fulfilled') {
    sessionsData = results[1].value;
  } else {
    console.error('Failed to fetch sessions:', results[1].reason);
  }

  return <Chat user={user} sessionsData={sessionsData} />;
}
