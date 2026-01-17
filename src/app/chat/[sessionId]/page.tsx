import React from 'react';
import { headers } from 'next/headers';
import Chat from '@/components/chat/Chat';
import { fetchUserServer, fetchSessionsServer, fetchCurrentSessionServer, fetchMessagesServer } from '@/lib/api/chat-server';
import type { User, Session, SessionsResponse, MessagesResponse } from '@/types/chat';

interface ChatSessionPageProps {
  readonly params: Promise<{ sessionId: string }>;
}

export default async function ChatSessionPage({ params }: ChatSessionPageProps): Promise<React.ReactElement> {
  const { sessionId } = await params;
  const headersList = await headers();
  const isNewUser = headersList.get('x-is-new-user') === 'true';

  let user: User | null = null;
  let sessionsData: SessionsResponse | null = null;
  let currentSession: Session | null = null;
  let messagesData: MessagesResponse | null = null;

  if (!isNewUser) {
    const results = await Promise.allSettled([
      fetchUserServer(),
      fetchSessionsServer(1, 50),
      fetchCurrentSessionServer(sessionId),
      fetchMessagesServer(sessionId, 1, 50),
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

    if (results[2].status === 'fulfilled') {
      currentSession = results[2].value;
    } else {
      console.error('Failed to fetch current session:', results[2].reason);
    }

    if (results[3].status === 'fulfilled') {
      messagesData = results[3].value;
    } else {
      console.error('Failed to fetch messages:', results[3].reason);
    }
  }

  return <Chat 
    user={user} 
    sessionsData={sessionsData} 
    currentSession={currentSession}
    messagesData={messagesData}
  />;
}
