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
  const userMessageRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);
  const lastMessage = messages.at(-1);
  
  const hasAITextContent = React.useMemo(() => {
    if (!lastMessage || lastMessage.role !== 'assistant') return false;
    return lastMessage.parts?.some((part: any) => 
      part.type === 'text' && part.text && part.text.trim().length > 0
    ) || false;
  }, [lastMessage]);
  
  const showPlaceholder = lastMessage?.role === 'user' && !hasAITextContent;

  const scrollToUserMessage = React.useCallback(() => {
    if (userMessageRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = userMessageRef.current;
      // Calculate position using getBoundingClientRect for accuracy
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      // Current distance from element to container top + current scroll = absolute position
      const scrollOffset = container.scrollTop + (elementRect.top - containerRect.top) - 70;
      container.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'smooth'
      });
    }
  }, []);

  // Initial scroll to latest user message on page load (instant, not smooth)
  // Uses MutationObserver to handle lazy-loaded code blocks
  useEffect(() => {
    if (hasInitialScrolled.current || messages.length === 0) return;
    
    const container = scrollContainerRef.current;
    const element = userMessageRef.current;
    if (!container || !element) return;

    const scrollToLatestUserMessage = () => {
      if (!scrollContainerRef.current || !userMessageRef.current) return;
      const c = scrollContainerRef.current;
      const el = userMessageRef.current;
      const containerRect = c.getBoundingClientRect();
      const elementRect = el.getBoundingClientRect();
      const scrollOffset = c.scrollTop + (elementRect.top - containerRect.top) - 70;
      c.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'instant'
      });
    };

    // Initial scroll
    requestAnimationFrame(scrollToLatestUserMessage);

    // Use MutationObserver to detect DOM changes (lazy-loaded code blocks)
    const observer = new MutationObserver(() => {
      scrollToLatestUserMessage();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    // Stop observing after 2 seconds (enough time for lazy content to load)
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      scrollToLatestUserMessage();
      hasInitialScrolled.current = true;
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [messages.length]);

  // Scroll when user sends a new message - smooth
  useEffect(() => {
    if (!hasInitialScrolled.current) return;
    
    const currentLastMessage = messages.at(-1);
    if (!currentLastMessage) return;

    if ((currentLastMessage.role === 'user' || showPlaceholder) && userMessageRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToUserMessage();
        });
      });
    }
  }, [messages.length, scrollToUserMessage, showPlaceholder]);

  const renderMessages = () => {
    // Find the last user message index (for initial scroll on page load)
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }
    
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
      
      const isUserMessage = message.role === 'user';
      const isLastUserMessage = isUserMessage && index === lastUserMessageIndex;
      const shouldRefAI = !isUserMessage && isLatest && !showPlaceholder;
      
      return (
        <div
          key={message.id}
          ref={isLastUserMessage ? userMessageRef : (shouldRefAI ? latestMessageRef : undefined)}
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
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-[image:var(--chat-background-alt)] pt-16 pb-32 chat-scroll-container"
      >
        <div className="w-11/12 sm:w-7/12 xl:w-1/2 mx-auto py-6">
          {renderMessages()}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-2 z-50">
        <div className="h-8 bg-gradient-to-b from-transparent to-[hsl(222,34%,10%)] pointer-events-none" />
        <div className="bg-[hsl(222,34%,10%)] pb-4">
          <ChatInput newChat={false} />
        </div>
      </div>
    </div>
  );
}
;

export default ChatMessages;
