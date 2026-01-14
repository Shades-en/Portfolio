import React from 'react';
import { headers } from 'next/headers';
import Chat from '@/components/chat/Chat';
import { fetchUserServer, fetchSessionsServer } from '@/lib/api/chat-server';
import type { User, SessionsResponse } from '@/types/chat';

export default async function ChatPage(): Promise<React.ReactElement> {
  const headersList = await headers();
  const isNewUser = headersList.get('x-is-new-user') === 'true';

  let user: User | null = null;
  let sessionsData: SessionsResponse | null = null;

  if (!isNewUser) {
    const results = await Promise.allSettled([
      fetchUserServer(),
      fetchSessionsServer(1, 50),
    ]);

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
  }

  return <Chat isNewUser={isNewUser} user={user} sessionsData={sessionsData} />;
}