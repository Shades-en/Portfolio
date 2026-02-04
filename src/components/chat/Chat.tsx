'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ChatSidebar from '@/components/chat/sidebar/ChatSidebar';
import ChatHeader from '@/components/chat/header/ChatHeader';
import ChatMessages from '@/components/chat/message/ChatMessages';
import ChatInput from './message/ChatInput';
import SessionNotFound from './SessionNotFound';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  hydrateUserAndSessions, setCurrentSession, setResponsiveState 
} from '@/store/slices/chatSlice';
import { breakpoints } from '@/config';
import type { User, Session, SessionsResponse, MessagesResponse } from '@/types/chat';
import { useSharedChatContext } from '@/app/contexts/chat-context';
import { useChat } from '@ai-sdk/react';

interface ChatProps {
  readonly user: User | null;
  readonly sessionsData: SessionsResponse | null;
  readonly messagesData?: MessagesResponse | null;
  readonly currentSession?: Session | null;
}

export default function Chat({ 
  user, 
  sessionsData, 
  messagesData, 
  currentSession
}: ChatProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const reduxCurrentSession = useAppSelector((state) => state.chat.currentSession);
  const { isTablet, isMobile } = useAppSelector((state) => state.chat);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const prevSessionIdRef = useRef<string | null>(null);
  
  const isOnSessionPage = pathname?.startsWith('/chat/') && pathname !== '/chat';
  const sessionNotFound = isOnSessionPage && !currentSession;

  const { chat } = useSharedChatContext();
  const { setMessages } = useChat({ chat });

  useEffect(() => {
    if (user || sessionsData) {
      dispatch(hydrateUserAndSessions({ user, sessionsData }));
    }
  }, [dispatch, user, sessionsData]);

  useEffect(() => {
    if (currentSession) {
      dispatch(setCurrentSession(currentSession));
      if (messagesData?.results) {
        // Use AI SDK to manage messages instead of Redux
        // Message type extends UIMessage, so this is safe
        setMessages([...messagesData.results] as any);
      }
    } else {
      // Clear messages in AI SDK
      setMessages([]);
      dispatch(setCurrentSession(null));
    }
  }, [dispatch, currentSession, messagesData, setMessages]);


  useEffect(() => {
    const handleResize = (): void => {
      const width = globalThis.window?.innerWidth ?? 0;
      const tablet = width < breakpoints.tablet && width >= breakpoints.mobile;
      const mobile = width < breakpoints.mobile;
      dispatch(setResponsiveState({ isTablet: tablet, isMobile: mobile }));
    };
    handleResize();
    // Set initial sidebar state based on screen size after hydration
    const shouldCollapse = globalThis.window !== undefined && globalThis.window.innerWidth < breakpoints.tablet;
    setSidebarCollapsed(shouldCollapse);
    setIsHydrated(true);
    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    // On mobile/tablet: keep sidebar collapsed
    // On desktop: expand sidebar
    if (isTablet || isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isTablet, isMobile]);

  useEffect(() => {
    if (prevSessionIdRef.current && !reduxCurrentSession && pathname?.startsWith('/chat/')) {
      router.push('/chat');
    }
    prevSessionIdRef.current = reduxCurrentSession?.id || null;
  }, [reduxCurrentSession, pathname, router]);

  const renderChatContent = () => {
    if (sessionNotFound) {
      return <SessionNotFound />;
    }
    
    if (currentSession) {
      return <ChatMessages />;
    }
    
    return (
      <div className="flex-1 flex flex-col min-h-0 relative overscroll-none">
        <ChatInput newChat={true} />
      </div>
    );
  };

  return (
    <div className="h-[100dvh] flex overflow-hidden w-full" style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
      <ChatSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        isHydrated={isHydrated}
      />
      <div className="flex-1 flex flex-col bg-[image:var(--chat-background-alt)] min-h-0 relative overflow-hidden">
        <ChatHeader
          onMenuClick={() => setSidebarCollapsed(false)}
        />
        {renderChatContent()}
      </div>
    </div>
  );
}

// See why tool calls are not working - it is not even saving it in backend see why? - Maybe connection closing early? it is not waiting for input response to be generated? 
//        Is it because function call responses are not recieved by frontend? Check with dev tools? 
//        Is it because toolName is not recieved??
// New session UI aggregate

// When API not working then when i send message and i dont get response in X amount of time then show error message in UI atleast like time out or check internet connection
