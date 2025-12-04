'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';

interface Message {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: Date;
}

interface ChatMessagesProps {
  readonly messages?: readonly Message[];
  readonly isMobile?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages = [], isMobile = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overscroll-none">
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[image:var(--chat-background-alt)] pt-16 mb-16">
        <div className="w-11/12 sm:w-7/12 xl:w-1/2 mx-auto py-6 space-y-6 pb-[calc(env(safe-area-inset-bottom)+120px)] sm:pb-60">
          {messages.length !== 0 && (
            messages.map((message) => (
              <ChatMessageItem key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput newChat={messages.length === 0} isMobile={isMobile}/>
    </div>
  );
};

export default ChatMessages;
