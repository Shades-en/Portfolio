import React from 'react';
import { ChatProvider } from '@/app/contexts/chat-context';

interface ChatLayoutProps {
  readonly children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}
