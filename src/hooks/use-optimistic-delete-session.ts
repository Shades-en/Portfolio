'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { deleteSession } from '@/lib/api/chat';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeSession, restoreSession } from '@/store/slices/chatSlice';
import type { Session } from '@/types/chat';

interface UseOptimisticDeleteSessionResult {
  readonly deleteSessionOptimistic: (sessionId: string) => Promise<boolean>;
}

export function useOptimisticDeleteSession(): UseOptimisticDeleteSessionResult {
  const dispatch = useAppDispatch();
  const { sessions, currentSession } = useAppSelector((state) => state.chat);
  const router = useRouter();

  const deleteSessionOptimistic = useCallback(async (sessionId: string): Promise<boolean> => {
    const sessionIndex = sessions.findIndex((session: Session) => session.id === sessionId);
    if (sessionIndex === -1) {
      toast({
        title: 'Chat not found',
        description: 'We could not find that chat in your list.',
        variant: 'warning',
      });
      return false;
    }

    const sessionToRemove = sessions[sessionIndex];
    const wasCurrent = currentSession?.id === sessionId;

    dispatch(removeSession({ sessionId }));
    if (wasCurrent) {
      router.push('/chat');
    }

    try {
      const success = await deleteSession(sessionId);
      if (!success) {
        throw new Error('Delete session request failed');
      }
      return true;
    } catch (error) {
      dispatch(
        restoreSession({
          session: sessionToRemove,
          index: sessionIndex,
          wasCurrent,
        })
      );
      if (wasCurrent) {
        router.push(`/chat/${sessionId}`);
      }
      toast({
        title: 'Unable to delete chat',
        description: 'The server responded with an error. Please try again.',
        variant: 'warning',
      });
      return false;
    }
  }, [dispatch, sessions, currentSession, router]);

  return { deleteSessionOptimistic };
}
