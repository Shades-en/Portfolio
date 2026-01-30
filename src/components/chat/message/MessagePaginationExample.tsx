/**
 * Example component showing how to implement message pagination
 * with Redux metadata + AI SDK messages
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessagesRequest } from '@/store/slices/chatSlice';
import { useSharedChatContext } from '@/app/contexts/chat-context';
import { useChat } from '@ai-sdk/react';
import { fetchMessages } from '@/lib/api/chat';

export function useMessagePagination(sessionId: string | null) {
  const dispatch = useAppDispatch();
  const { chat } = useSharedChatContext();
  const { messages, setMessages } = useChat({ chat });
  
  // Get pagination metadata from Redux
  const { pagination, loading } = useAppSelector((state) => ({
    pagination: state.chat.pagination.messages,
    loading: state.chat.loading.messages,
  }));

  // Load initial messages
  useEffect(() => {
    if (sessionId) {
      loadMessages(1);
    }
  }, [sessionId]);

  const loadMessages = async (page: number) => {
    if (!sessionId) return;

    // Dispatch Redux action to update pagination metadata
    dispatch(fetchMessagesRequest({
      sessionId,
      page,
      pageSize: pagination.pageSize,
    }));

    // Fetch messages from API
    const messagesData = await fetchMessages(sessionId, page, pagination.pageSize);
    
    if (messagesData?.results) {
      if (page === 1) {
        // First page - replace all messages
        setMessages([...messagesData.results] as any);
      } else {
        // Subsequent pages - prepend older messages
        setMessages((prev) => [...messagesData.results, ...prev] as any);
      }
    }
  };

  const loadMoreMessages = () => {
    if (pagination.hasNext && !loading) {
      loadMessages(pagination.page + 1);
    }
  };

  return {
    messages,
    pagination,
    loading,
    loadMoreMessages,
    hasMore: pagination.hasNext,
  };
}

// Example usage in a component:
export function ChatMessagesWithPagination() {
  const currentSession = useAppSelector((state) => state.chat.currentSession);
  const { messages, pagination, loading, loadMoreMessages, hasMore } = useMessagePagination(
    currentSession?.id || null
  );

  return (
    <div>
      {/* Load more button */}
      {hasMore && (
        <button onClick={loadMoreMessages} disabled={loading}>
          {loading ? 'Loading...' : `Load More (${pagination.totalCount - messages.length} remaining)`}
        </button>
      )}

      {/* Messages list */}
      {messages.map((message) => (
        <div key={message.id}>{/* Your message component */}</div>
      ))}
    </div>
  );
}
