'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';
import { useSharedChatContext } from '@/app/contexts/chat-context';
import { useChat } from '@ai-sdk/react';

interface ChatMessagesProps {
}

const ChatMessages: React.FC<ChatMessagesProps> = () => {
  const { chat } = useSharedChatContext();
  const { messages, status } = useChat({ chat, experimental_throttle: 1 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages.at(-1);
  
  const hasAITextContent = React.useMemo(() => {
    if (!lastMessage || lastMessage.role !== 'assistant') return false;
    return lastMessage.parts?.some((part: any) => 
      part.type === 'text' && part.text && part.text.trim().length > 0
    ) || false;
  }, [lastMessage]);
  
  const showPlaceholder = lastMessage?.role === 'user' && !hasAITextContent;

  const scrollToUserMessage = React.useCallback(() => {
    latestMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  useEffect(() => {
    const currentLastMessage = messages.at(-1);
    if (!currentLastMessage) {
      return;
    }

    if ((currentLastMessage.role === 'user' || showPlaceholder) && latestMessageRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToUserMessage();
        });
      });
    }
  }, [messages.length, scrollToUserMessage, showPlaceholder]);

  const renderMessages = () => {
    const messageElements = messages.map((message, index) => {
      const isLatest = index === messages.length - 1;
      const isAIMessage = message.role === 'assistant';
      const isStreaming = status === 'streaming';
      const isCompleted = status === 'ready';
      const shouldReserveSpace = isAIMessage && isLatest && (isStreaming || isCompleted);
      
      let messageStyle: React.CSSProperties | undefined;
      if (shouldReserveSpace) {
        messageStyle = { minHeight: 'calc(100dvh - 248px)' };
      }
      
      return (
        <div
          key={message.id}
          ref={isLatest && !showPlaceholder ? latestMessageRef : undefined}
          className="py-2"
          style={messageStyle}
        >
          <ChatMessageItem message={message} isStreaming={isLatest && isStreaming} />
        </div>
      );
    });

    if (showPlaceholder) {
      messageElements.push(
        <div
          key="placeholder-generating"
          ref={latestMessageRef}
          className="py-2"
          style={{ minHeight: 'calc(100dvh - 248px)' }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground animate-pulse">
                Generating...
              </div>
            </div>
          </div>
        </div>
      );
    }

    return messageElements;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overscroll-none">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar bg-[image:var(--chat-background-alt)] pt-16 mb-16"
      >
        <div className="w-11/12 sm:w-7/12 xl:w-1/2 mx-auto py-6">
          {renderMessages()}
        </div>
      </div>
      <ChatInput newChat={false} />
    </div>
  );
}
;

export default ChatMessages;
