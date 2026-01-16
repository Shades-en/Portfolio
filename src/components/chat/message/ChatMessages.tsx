'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';
import { useAppSelector } from '@/store/hooks';

interface ChatMessagesProps {}

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

  // Pre-calculate which messages are the last AI in their turn (O(n) instead of O(n²))
  const lastAIMessageIds = React.useMemo(() => {
    const lastAIPerTurn = new Map<number, string>();
    
    // Iterate backwards to find the last AI message for each turn
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'ai' && !lastAIPerTurn.has(msg.turn_number)) {
        lastAIPerTurn.set(msg.turn_number, msg.id);
      }
    }
    
    return new Set(lastAIPerTurn.values());
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
                  isLastAIInTurn={lastAIMessageIds.has(message.id)}
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
