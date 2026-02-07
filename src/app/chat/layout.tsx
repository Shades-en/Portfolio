'use client';

import React, { useEffect, useState } from 'react';
import { ChatProvider } from '@/app/contexts/chat-context';
import ChatSidebar from '@/components/chat/sidebar/ChatSidebar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setResponsiveState, setSidebarCollapsed } from '@/store/slices/chatSlice';
import { breakpoints } from '@/config';

interface ChatLayoutProps {
  readonly children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const dispatch = useAppDispatch();
  const { isTablet, isMobile, sidebarCollapsed } = useAppSelector((state) => state.chat);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const handleCollapsedChange = (collapsed: boolean): void => {
    dispatch(setSidebarCollapsed(collapsed));
  };

  useEffect(() => {
    const handleResize = (): void => {
      const width = globalThis.window?.innerWidth ?? 0;
      const tablet = width < breakpoints.tablet && width >= breakpoints.mobile;
      const mobile = width < breakpoints.mobile;
      dispatch(setResponsiveState({ isTablet: tablet, isMobile: mobile }));
    };
    handleResize();
    const shouldCollapse = globalThis.window !== undefined && globalThis.window.innerWidth < breakpoints.tablet;
    dispatch(setSidebarCollapsed(shouldCollapse));
    setIsHydrated(true);
    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (isTablet || isMobile) {
      dispatch(setSidebarCollapsed(true));
    } else {
      dispatch(setSidebarCollapsed(false));
    }
  }, [isTablet, isMobile, dispatch]);

  return (
    <ChatProvider>
      <div className="h-[100dvh] flex overflow-hidden w-full" style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleCollapsedChange}
          isHydrated={isHydrated}
        />
        <div className="flex-1 flex flex-col bg-[image:var(--chat-background-alt)] min-h-0 relative overflow-hidden">
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}
