'use client';

import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

interface Message {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: Date;
}

export default function ChatPage(): React.ReactElement {
  const [activeMessages, setActiveMessages] = useState<readonly Message[]>([]);

  return (
    <>
      <ChatSidebar onChatSelect={setActiveMessages} />
      <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(135deg, hsl(200, 60%, 8%) 0%, hsl(200, 65%, 4%) 50%, hsl(200, 55%, 6%) 100%)' }}>
        <ChatHeader />
        <ChatMessages messages={activeMessages} />
        <ChatInput />
      </div>
    </>
  );
}
