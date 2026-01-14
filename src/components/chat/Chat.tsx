'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatSidebar from '@/components/chat/sidebar/ChatSidebar';
import ChatHeader from '@/components/chat/header/ChatHeader';
import ChatMessages from '@/components/chat/message/ChatMessages';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMessagesRequest,
  setCurrentSession,
  hydrateUserAndSessions,
  setResponsiveState,
  createTemporarySession,
} from '@/store/slices/chatSlice';
import type { User, SessionsResponse } from '@/types/chat';

interface ChatProps {
  readonly isNewUser: boolean;
  readonly user: User | null;
  readonly sessionsData: SessionsResponse | null;
}

export default function Chat({ isNewUser, user, sessionsData }: ChatProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const { sessions, temporarySessions, currentSessionId, isTablet, isMobile } = useAppSelector((state) => state.chat);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!isNewUser && (user || sessionsData)) {
      dispatch(hydrateUserAndSessions({ user, sessionsData }));
    }
  }, [dispatch, isNewUser, user, sessionsData]);

  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      const mostRecentSession = sessions[0];
      dispatch(setCurrentSession(mostRecentSession.id));
      dispatch(fetchMessagesRequest({ sessionId: mostRecentSession.id, page: 1, pageSize: 50 }));
    } else if (sessions.length === 0 && temporarySessions.length === 0) {
      dispatch(createTemporarySession());
    }
  }, [sessions, temporarySessions, currentSessionId, dispatch]);

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
        <ChatMessages />
      </div>
    </div>
  );
}
