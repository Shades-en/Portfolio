import React from 'react';
import Chat from '@/components/chat/Chat';

interface ChatSessionPageProps {
  readonly params: Promise<{ sessionId: string }>;
}

export default async function ChatSessionPage({ params }: ChatSessionPageProps): Promise<React.ReactElement> {
  const { sessionId } = await params;
  return <Chat sessionId={sessionId} />;
}
