'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { chatConfig } from '@/config';

interface UseChatTimeoutOptions {
  readonly isWaiting: boolean;
  readonly title?: string;
  readonly description?: string;
}

interface UseChatTimeoutResult {
  readonly hasTimedOut: boolean;
}

/**
 * Hook to handle chat request timeout with toast notification.
 * Shows a warning toast when waiting for response exceeds the configured timeout.
 */
export function useChatTimeout({
  isWaiting,
  title = 'Connection Issue',
  description = 'Unable to reach the server. Please check your internet connection and try again.',
}: UseChatTimeoutOptions): UseChatTimeoutResult {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isWaiting) {
      setHasTimedOut(false);
      timeoutRef.current = setTimeout(() => {
        setHasTimedOut(true);
        toast({ title, description, variant: 'warning' });
      }, chatConfig.requestTimeoutMs);
    } else {
      setHasTimedOut(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isWaiting, title, description]);

  return { hasTimedOut };
}
