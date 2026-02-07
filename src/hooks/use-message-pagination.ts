'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMessagesSuccess } from '@/store/slices/chatSlice';
import { fetchMessages } from '@/lib/api/chat';
import { toast } from '@/hooks/use-toast';
import type { Message } from '@/types/chat';

interface UseMessagePaginationOptions {
  readonly scrollContainerRef: React.RefObject<HTMLDivElement>;
  readonly setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

interface UseMessagePaginationResult {
  readonly isLoadingMore: boolean;
  readonly hasMoreMessages: boolean;
  readonly loadMoreRef: React.RefObject<HTMLDivElement>;
  readonly loadError: string | null;
  readonly retryLoadMore: () => void;
}

const SCROLL_THRESHOLD = 100;

/**
 * Hook to handle message pagination with infinite scroll.
 * Loads older messages when user scrolls near the top.
 */
export function useMessagePagination({
  scrollContainerRef,
  setMessages,
}: UseMessagePaginationOptions): UseMessagePaginationResult {
  const dispatch = useAppDispatch();
  const { currentSession, pagination } = useAppSelector((state) => state.chat);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(1);
  const hasMoreMessages = pagination.messages.hasNext;
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMoreMessages = useCallback(async ({ force = false }: { force?: boolean } = {}) => {
    if (isLoadingMore || !currentSession?.id || !hasMoreMessages) return;
    if (loadError && !force) return;

    const nextPage = currentPageRef.current + 1;
    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const container = scrollContainerRef.current;
      const scrollHeightBefore = container?.scrollHeight ?? 0;

      const response = await fetchMessages(currentSession.id, nextPage, pagination.messages.pageSize);

      if (response) {
        currentPageRef.current = nextPage;
        dispatch(fetchMessagesSuccess({
          page: response.page,
          pageSize: response.page_size,
          totalPages: response.total_pages,
          totalCount: response.total_count,
          hasNext: response.has_next,
          hasPrevious: response.has_previous,
        }));

        // Prepend older messages
        const olderMessages = [...response.results] as Message[];
        setMessages((prev: Message[]) => [...olderMessages, ...prev]);

        // Restore scroll position after prepending
        requestAnimationFrame(() => {
          if (container) {
            const scrollHeightAfter = container.scrollHeight;
            const heightDiff = scrollHeightAfter - scrollHeightBefore;
            container.scrollTop = heightDiff;
          }
        });
      } else {
        throw new Error('No response for older messages');
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast({
        title: 'Unable to load older messages',
        description: 'Please check your connection and try scrolling again.',
        variant: 'warning',
      });
      setLoadError('Unable to load older messages');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, currentSession?.id, hasMoreMessages, pagination.messages.pageSize, dispatch, setMessages, scrollContainerRef, loadError]);

  const retryLoadMore = useCallback(() => {
    setLoadError(null);
    void loadMoreMessages({ force: true });
  }, [loadMoreMessages]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement || !hasMoreMessages || loadError) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          void loadMoreMessages();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: `${SCROLL_THRESHOLD}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreMessages, loadError, isLoadingMore, loadMoreMessages, scrollContainerRef]);

  // Reset page when session changes
  useEffect(() => {
    currentPageRef.current = 1;
  }, [currentSession?.id]);

  return {
    isLoadingMore,
    hasMoreMessages,
    loadMoreRef,
    loadError,
    retryLoadMore,
  };
}
