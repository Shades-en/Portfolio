'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseChatScrollOptions {
  readonly messagesLength: number;
  readonly showPlaceholder: boolean;
  readonly lastMessageRole?: string;
}

interface UseChatScrollResult {
  readonly scrollContainerRef: React.RefObject<HTMLDivElement>;
  readonly latestMessageRef: React.RefObject<HTMLDivElement>;
  readonly userMessageRef: React.RefObject<HTMLDivElement>;
  readonly hasInitialScrolled: React.RefObject<boolean>;
  readonly scrollToUserMessage: () => void;
}

const SCROLL_OFFSET = 70;
const INITIAL_SCROLL_TIMEOUT = 2000;

/**
 * Hook to handle chat scroll behavior.
 * Manages initial scroll to latest user message and smooth scroll on new messages.
 */
export function useChatScroll({
  messagesLength,
  showPlaceholder,
  lastMessageRole,
}: UseChatScrollOptions): UseChatScrollResult {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const userMessageRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);

  const scrollToUserMessage = useCallback(() => {
    if (userMessageRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = userMessageRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollOffset = container.scrollTop + (elementRect.top - containerRect.top) - SCROLL_OFFSET;
      container.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'smooth',
      });
    }
  }, []);

  // Initial scroll to latest user message on page load (instant, not smooth)
  // Uses MutationObserver to handle lazy-loaded code blocks
  useEffect(() => {
    if (hasInitialScrolled.current || messagesLength === 0) return;

    const container = scrollContainerRef.current;
    const element = userMessageRef.current;
    if (!container || !element) return;

    const scrollToLatestUserMessage = (): void => {
      if (!scrollContainerRef.current || !userMessageRef.current) return;
      const c = scrollContainerRef.current;
      const el = userMessageRef.current;
      const containerRect = c.getBoundingClientRect();
      const elementRect = el.getBoundingClientRect();
      const scrollOffset = c.scrollTop + (elementRect.top - containerRect.top) - SCROLL_OFFSET;
      c.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'instant',
      });
    };

    requestAnimationFrame(scrollToLatestUserMessage);

    const observer = new MutationObserver(() => {
      scrollToLatestUserMessage();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      scrollToLatestUserMessage();
      hasInitialScrolled.current = true;
    }, INITIAL_SCROLL_TIMEOUT);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [messagesLength]);

  // Scroll when user sends a new message - smooth
  useEffect(() => {
    if (!hasInitialScrolled.current) return;

    if ((lastMessageRole === 'user' || showPlaceholder) && userMessageRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToUserMessage();
        });
      });
    }
  }, [messagesLength, scrollToUserMessage, showPlaceholder, lastMessageRole]);

  return {
    scrollContainerRef,
    latestMessageRef,
    userMessageRef,
    hasInitialScrolled,
    scrollToUserMessage,
  };
}
