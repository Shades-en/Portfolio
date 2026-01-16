'use client';

import React, { useState, useEffect } from 'react';
import ChatSidebar from '@/components/chat/sidebar/ChatSidebar';
import ChatHeader from '@/components/chat/header/ChatHeader';
import ChatMessages from '@/components/chat/message/ChatMessages';
import ChatInput from './message/ChatInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentSession,
  hydrateUserAndSessions,
  hydrateMessages,
  resetMessages,
  setResponsiveState,
} from '@/store/slices/chatSlice';
import type { User, SessionsResponse, MessagesResponse } from '@/types/chat';

interface ChatProps {
  readonly user: User | null;
  readonly sessionsData: SessionsResponse | null;
  readonly messagesData?: MessagesResponse | null;
  readonly sessionId?: string;
}

export default function Chat({ 
  user, 
  sessionsData, 
  messagesData, 
  sessionId
}: ChatProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const { isTablet, isMobile } = useAppSelector((state) => state.chat);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (user || sessionsData) {
      dispatch(hydrateUserAndSessions({ user, sessionsData }));
    }
  }, [dispatch, user, sessionsData]);

  useEffect(() => {
    if (sessionId) {
      dispatch(setCurrentSession(sessionId));
      if (messagesData) {
        dispatch(hydrateMessages(messagesData));
      }
    } else {
      dispatch(resetMessages());
      dispatch(setCurrentSession(''));
    }
  }, [dispatch, sessionId, messagesData]);


  useEffect(() => {
    const handleResize = (): void => {
      const tablet = globalThis.window !== undefined && globalThis.window.innerWidth < 950 && globalThis.window.innerWidth >= 640;
      const mobile = globalThis.window !== undefined && globalThis.window.innerWidth < 640;
      dispatch(setResponsiveState({ isTablet: tablet, isMobile: mobile }));
    };
    handleResize();
    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (isTablet || isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isTablet, isMobile]);

  return (
    <div className="h-[100dvh] flex overflow-hidden w-full" style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
      <ChatSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col bg-[image:var(--chat-background-alt)] min-h-0 relative overflow-hidden">
        <ChatHeader
          onMenuClick={() => setSidebarCollapsed(false)}
        />
        {sessionId ? <ChatMessages /> : 
          <div className="flex-1 flex flex-col min-h-0 relative overscroll-none">
            <ChatInput newChat={true} />
          </div>
        }
      </div>
    </div>
  );
}
