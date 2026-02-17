'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';
import { useSharedChatContext } from '@/app/contexts/chat-context';
import { useChat } from '@ai-sdk/react';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useMessagePagination } from '@/hooks/use-message-pagination';
import { toast } from '@/hooks/use-toast';
import { useAppSelector } from '@/store/hooks';
import type { Message } from '@/types/chat';

interface ChatMessagesProps {
}

const ChatMessages: React.FC<ChatMessagesProps> = () => {
  const { currentSession } = useAppSelector((state) => state.chat);
  const { getOrCreateChat } = useSharedChatContext();
  const chat = getOrCreateChat(currentSession?.id ?? 'new');
  const { messages, status, error, setMessages } = useChat({ chat, experimental_throttle: 1 });
  const lastMessage = messages.at(-1);
  const hasShownErrorToast = useRef(false);
  
  const hasAITextContent = React.useMemo(() => {
    if (!lastMessage || lastMessage.role !== 'assistant') return false;
    return lastMessage.parts?.some((part: any) => 
      part.type === 'text' && part.text && part.text.trim().length > 0
    ) || false;
  }, [lastMessage]);
  
  const showPlaceholderBase = lastMessage?.role === 'user' && !hasAITextContent;
  const hasError = status === 'error' && error?.message?.includes('Failed to fetch');
  const showPlaceholder = showPlaceholderBase && !hasError;

  // Show toast when fetch error occurs
  useEffect(() => {
    if (hasError && !hasShownErrorToast.current) {
      hasShownErrorToast.current = true;
      toast({
        title: 'Connection Issue',
        description: 'Unable to reach the server. Please check your internet connection and try again.',
        variant: 'warning',
      });
    }
    if (!hasError) {
      hasShownErrorToast.current = false;
    }
  }, [hasError]);

  const {
    scrollContainerRef,
    latestMessageRef,
    userMessageRef,
  } = useChatScroll({
    messagesLength: messages.length,
    showPlaceholder,
    lastMessageRole: lastMessage?.role,
  });

  const {
    isLoadingMore,
    hasMoreMessages,
    loadMoreRef,
    loadError,
    retryLoadMore,
  } = useMessagePagination({
    scrollContainerRef,
    setMessages: setMessages as (messages: Message[] | ((prev: Message[]) => Message[])) => void,
  });

  const renderMessages = () => {
    // Find the last user message index (for initial scroll on page load)
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }

    const messageElements: React.ReactNode[] = [];

    // Load more trigger at the top
    if (hasMoreMessages) {
      messageElements.push(
        <div
          key="load-more-trigger"
          ref={loadMoreRef}
          className="flex justify-center py-2"
        >
          {isLoadingMore && !loadError && (
            <div className="p-2 rounded-full bg-primary/10 text-primary shadow-inner">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {loadError && (
            <button
              type="button"
              onClick={retryLoadMore}
              className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              <Loader2 className="h-3 w-3" />
              Retry loading older messages
            </button>
          )}
        </div>
      );
    }
    
    messages.forEach((message, index) => {
      const isLatest = index === messages.length - 1;
      const isAIMessage = message.role === 'assistant';
      const isStreamingStatus = status === 'streaming';
      const isCompleted = status === 'ready';
      const isErrorMessage = (message as any).metadata?.error === true;
      const shouldReserveSpace = (isAIMessage && isLatest && (isStreamingStatus || isCompleted)) || (isErrorMessage && isLatest);
      
      let messageStyle: React.CSSProperties | undefined;
      if (shouldReserveSpace) {
        messageStyle = { minHeight: 'calc(100dvh - 248px)' };
      }
      
      const isUserMessage = message.role === 'user';
      const isLastUserMessage = isUserMessage && index === lastUserMessageIndex;
      const shouldRefAI = !isUserMessage && isLatest && !showPlaceholder;
      
      const getMessageRef = (): React.RefObject<HTMLDivElement> | undefined => {
        if (isLastUserMessage) return userMessageRef;
        if (shouldRefAI) return latestMessageRef;
        return undefined;
      };
      
      messageElements.push(
        <div
          key={message.id}
          ref={getMessageRef()}
          className="py-2"
          style={messageStyle}
        >
          <ChatMessageItem message={message} isStreaming={isLatest && isStreamingStatus} />
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
