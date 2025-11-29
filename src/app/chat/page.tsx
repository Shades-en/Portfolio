import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

export const metadata = {
  title: 'Chat | Portfolio',
  description: 'Chat with AI assistant about my portfolio and projects',
};

export default function ChatPage(): React.ReactElement {
  return (
    <>
      <ChatSidebar />
      <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(135deg, hsl(200, 60%, 8%) 0%, hsl(200, 65%, 4%) 50%, hsl(200, 55%, 6%) 100%)' }}>
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </>
  );
}
