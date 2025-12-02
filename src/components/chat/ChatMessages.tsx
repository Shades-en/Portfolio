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
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages = [] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 overflow-y-auto no-scrollbar mb-10 bg-[image:var(--chat-background-alt)] overscroll-y-contain pt-16">
        <div className="w-7/12 mx-auto py-6 space-y-6 mb-60">
          {messages.length !== 0 && (
            messages.map((message) => (
              <ChatMessageItem key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput newChat={messages.length === 0}/>
    </div>
  );
};

export default ChatMessages;
