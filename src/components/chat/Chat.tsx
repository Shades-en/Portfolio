'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ChatHeader from '@/components/chat/header/ChatHeader';
import ChatMessages from '@/components/chat/message/ChatMessages';
import ChatInput from './message/ChatInput';
import SessionNotFound from './SessionNotFound';
import ChatMessagesSkeleton from './skeleton/ChatMessagesSkeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchInitialDataRequest, setCurrentSession, fetchMessagesSuccess,
  setLoadingCurrentSession, setCurrentSessionError
} from '@/store/slices/chatSlice';
import { useSharedChatContext } from '@/app/contexts/chat-context';
import { useChat } from '@ai-sdk/react';
import { fetchSession, fetchMessages } from '@/lib/api/chat';

interface ChatProps {
  readonly sessionId?: string;
}

export default function Chat({ 
  sessionId
}: ChatProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { 
    currentSession: reduxCurrentSession, 
    sessions: reduxSessions,
    user: reduxUser,
    loading,
    error
  } = useAppSelector((state) => state.chat);
  const prevSessionIdRef = useRef<string | null>(null);
  const hasFetchedSessionRef = useRef<string | null>(null);
  const hasFetchedInitialDataRef = useRef<boolean>(false);
  
  const isOnSessionPage = pathname?.startsWith('/chat/') && pathname !== '/chat';
  const isLoadingSession = loading.currentSession;
  const sessionError = error.currentSession;

  const { chat } = useSharedChatContext();
  const { messages, setMessages } = useChat({ chat });

  const fetchSessionAndMessages = useCallback(async (targetSessionId: string) => {
    if (hasFetchedSessionRef.current === targetSessionId) {
      return;
    }
    hasFetchedSessionRef.current = targetSessionId;
    
    // Clear messages immediately to show skeleton
    setMessages([]);
    dispatch(setLoadingCurrentSession(true));
    dispatch(setCurrentSessionError(null));

    try {
      const cachedSession = reduxSessions.find(s => s.id === targetSessionId);
      
      if (cachedSession) {
        dispatch(setCurrentSession(cachedSession));
      } else {
        const sessionData = await fetchSession(targetSessionId);
        if (!sessionData) {
          dispatch(setCurrentSessionError('not_found'));
          dispatch(setLoadingCurrentSession(false));
          return;
        }
        dispatch(setCurrentSession(sessionData));
      }

      const messagesData = await fetchMessages(targetSessionId, 1, 50);
      
      if (!messagesData) {
        dispatch(setCurrentSessionError('messages_error'));
        dispatch(setLoadingCurrentSession(false));
        return;
      }

      if (messagesData.results && messagesData.results.length > 0) {
        setMessages([...messagesData.results] as any);
        dispatch(fetchMessagesSuccess({
          page: messagesData.page,
          pageSize: messagesData.page_size,
          totalPages: messagesData.total_pages,
          totalCount: messagesData.total_count,
          hasNext: messagesData.has_next,
          hasPrevious: messagesData.has_previous,
        }));
      } else {
        setMessages([]);
      }
      
      dispatch(setLoadingCurrentSession(false));
    } catch {
      dispatch(setCurrentSessionError('server_error'));
      dispatch(setLoadingCurrentSession(false));
    }
  }, [dispatch, reduxSessions, setMessages]);

  useEffect(() => {
    if (hasFetchedInitialDataRef.current || reduxUser || reduxSessions.length > 0) {
      return;
    }
    hasFetchedInitialDataRef.current = true;
    dispatch(fetchInitialDataRequest());
  }, [dispatch, reduxUser, reduxSessions.length]);

  useEffect(() => {
    if (sessionId) {
      fetchSessionAndMessages(sessionId);
    } else {
      setMessages([]);
      dispatch(setCurrentSession(null));
      dispatch(setLoadingCurrentSession(false));
      hasFetchedSessionRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);


  useEffect(() => {
    if (prevSessionIdRef.current && !reduxCurrentSession && pathname?.startsWith('/chat/')) {
      router.push('/chat');
    }
    prevSessionIdRef.current = reduxCurrentSession?.id || null;
  }, [reduxCurrentSession, pathname, router]);

  const getErrorMessage = (errorType: string | null): { title: string; description: string } => {
    switch (errorType) {
      case 'not_found':
        return {
          title: "This conversation doesn't exist",
          description: "The chat you're looking for may have been deleted or never existed."
        };
      case 'messages_error':
        return {
          title: "Unable to load messages",
          description: "We couldn't retrieve the messages for this conversation. Please try again."
        };
      case 'server_error':
      default:
        return {
          title: "Something went wrong",
          description: "We encountered an error while loading this conversation. Please try again."
        };
    }
  };

  const isInitialLoading = loading.sessions && reduxSessions.length === 0;
  const isSessionPageWithoutSession = isOnSessionPage && !reduxCurrentSession && !sessionError;
  const isWaitingForMessages = isOnSessionPage && reduxCurrentSession && messages.length === 0 && !sessionError;
  
  const renderChatContent = () => {
    // Show skeleton while loading initial data, session/messages, on session page without session, or waiting for messages
    if (isInitialLoading || isLoadingSession || isSessionPageWithoutSession || isWaitingForMessages) {
      return <ChatMessagesSkeleton />;
    }

    // Show error state if session fetch failed
    if (sessionError && isOnSessionPage) {
      const { title, description } = getErrorMessage(sessionError);
      return <SessionNotFound title={title} description={description} />;
    }
    
    // Show ChatMessages if we have a session from Redux
    if (reduxCurrentSession) {
      return <ChatMessages />;
    }
    
    // Show new chat UI (only when not on a session page)
    return (
      <div className="flex-1 flex flex-col min-h-0 relative overscroll-none">
        <ChatInput newChat={true} />
      </div>
    );
  };

  return (
    <>
      <ChatHeader />
      {renderChatContent()}
    </>
  );
}

// When cookie not presrnt in browser it is unable to send message - fix it, or when cookie present first time but user object not yet created in db
// Convet the chat stream protocol from client to direct backend to server side call