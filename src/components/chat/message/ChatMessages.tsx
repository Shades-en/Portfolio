'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';
import { useAppSelector } from '@/store/hooks';

interface ChatMessagesProps {
}

const ChatMessages: React.FC<ChatMessagesProps> = () => {
  const { messages } = useAppSelector((state) => state.chat);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = React.useState(true);

  useEffect(() => {
    if (scrollContainerRef.current) {
      setIsScrolling(true);
      const scrollToBottom = () => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
      };
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
          setTimeout(() => {
            scrollToBottom();
            setIsScrolling(false);
          }, 50);
        });
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overscroll-none">
      <div 
        ref={scrollContainerRef} 
        className={`flex-1 overflow-y-auto no-scrollbar bg-[image:var(--chat-background-alt)] pt-16 mb-16 transition-opacity duration-150 ${isScrolling ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="w-11/12 sm:w-7/12 xl:w-1/2 mx-auto py-6 pb-[calc(env(safe-area-inset-bottom)+240px)] sm:pb-96">
          {messages.length > 0 && (
            <>
              {messages.map((message) => (
                <ChatMessageItem 
                  key={message.id} 
                  message={message}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <ChatInput newChat={false} />
    </div>
  );
};

export default ChatMessages;
