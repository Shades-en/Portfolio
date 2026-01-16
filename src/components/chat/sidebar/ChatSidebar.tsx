'use client';

import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import ChatListItem from './ChatList';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ChatSearchDialog from './ChatSearchDialog';
import SidebarLogo from './SidebarLogo';
import SidebarToggle from './SidebarToggle';
import NewChatButton from './NewChatButton';
import { useAppSelector } from '@/store/hooks';

interface ChatSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ collapsed, onCollapsedChange }) => {
  const { sessions, currentSessionId, isTablet, isMobile } = useAppSelector((state) => state.chat);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [opacityAnimationClasses, setOpacityAnimationClasses] = useState('transition-opacity duration-100 opacity-100');

  const allSessions = sessions;
  
  const filteredChats = allSessions
    .filter(session => session.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const starredChats = allSessions
    .filter(session => session.starred);
    
  const handleDeleteChat = (id: string, e?: React.MouseEvent): void => {
    if (e) e.stopPropagation();
  };


  useEffect(() => {
    const prevailingOpacityClass = "transition-opacity duration-100"
    const opacityAnimationClassChange = collapsed ? 'opacity-0' : 'opacity-100';
    setOpacityAnimationClasses(prevailingOpacityClass + " " + opacityAnimationClassChange);
  }, [collapsed]);

  const formatTime = (date: Date): string => {
    const now = Date.now();
    const t = new Date(date).getTime();
    const diffSec = Math.max(0, Math.floor((now - t) / 1000));
    if (diffSec < 60) return `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    const diffMon = Math.floor(diffDay / 30);
    if (diffMon < 12) return `${diffMon} mon ago`;
    const diffYear = Math.floor(diffMon / 12);
    return `${diffYear}y ago`;
  };

  const logoSize = 16;
  const shadesLogoSize = 24;

  const handleClearHistory = (): void => {
  };

  const widthClass: string = collapsed ? (isMobile ? 'w-0' : 'w-16') : 'w-64';

  return (
    <>
      {(isTablet || isMobile) && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => onCollapsedChange(true)}
          aria-hidden="true"
        />
      )}
      <div
        className={`${( isTablet || isMobile ) ? 'absolute z-50' : 'relative'} overflow-hidden border-r flex flex-col bg-[var(--chat-foreground)] h-full transition-all duration-200 ${widthClass}`}
      >
      <div className="px-4 pt-4 pb-0 mt-2">
        <div className="flex items-center justify-between gap-3 relative top-0 h-5">
          <SidebarLogo className={`absolute left-0 ${opacityAnimationClasses}`} />
          <SidebarToggle 
            collapsed={collapsed} 
            onToggle={onCollapsedChange} 
            className="absolute right-0" 
          />
        </div>
      </div>

      <div className="relative top-5 left-0 flex-1">
        <div className="w-full transition-transform duration-300">
          <div className="h-full flex flex-col justify-center">
            <div className="p-4 py-1 border-b border-slate-800 h-24">
              <div className="flex flex-col gap-2 h-full">
                <NewChatButton 
                  className={opacityAnimationClasses} 
                  onCollapsedChange={onCollapsedChange} 
                />
                <ChatSearchDialog
                  trigger={
                    <button className="flex items-center gap-3 px-0 py-1.5 text-white hover:text-primary transition-colors duration-200 group outline-none">
                      <div className='pl-2'>
                        <Search size={logoSize} className="text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap ${opacityAnimationClasses}`}>Search Chats</span>
                    </button>
                  }
                  open={isSearchOpen}
                  onOpenChange={setIsSearchOpen}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  items={filteredChats}
                  onDelete={(id) => handleDeleteChat(id)}
                  subtitleFor={formatTime}
                />
              </div>
            </div>
            <div 
              className="flex-1 overflow-y-auto no-scrollbar"
              style={{ background: 'linear-gradient(to bottom, hsl(222, 47%, 8%)/0, hsl(222, 47%, 4%))' }}
            >
              <div className={`p-3 px-2 mt-2 space-y-5 ${opacityAnimationClasses}`}>
                {starredChats.length > 0 && (
                  <div className='space-y-1'>
                    <div className='mb-3'>
                      <p className="text-xs font-medium text-slate-400 tracking-wide">Starred</p>
                    </div>
                    {starredChats.map((session) => (
                      <ChatListItem
                        key={session.id}
                        chat={session}
                        isActive={session.id === currentSessionId}
                        onDelete={(id) => handleDeleteChat(id)}
                        showTimestamp
                      />
                    ))}
                  </div>
                )}

                {allSessions.length > 0 && (
                  <div className='space-y-1'>
                    <div className='mb-3'>
                      <p className="text-xs font-medium text-slate-400 tracking-wide">Recents</p>
                    </div>
                    {allSessions.map((session) => (
                      <ChatListItem
                        key={session.id}
                        chat={session}
                        isActive={session.id === currentSessionId}
                        onDelete={(id) => handleDeleteChat(id)}
                        showTimestamp
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-2" style={{ borderColor: 'hsl(197, 92%, 56%)/10' }}>
        {collapsed ? (
          <div className="mt-auto w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <Image src="/white-logo/android-chrome-512x512.png" alt="Shades logo" width={shadesLogoSize} height={shadesLogoSize} className="w-full h-full object-cover" />          
          </div>
        ) : (
          <ConfirmDialog
            trigger={
              <button className={`flex items-center gap-3 px-0 py-1.5 text-slate-400 hover:text-red-500 transition-colors duration-200 group ${opacityAnimationClasses}`}>
                <Trash2 size={logoSize} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                <span className="text-xs font-medium whitespace-nowrap">Clear History</span>
              </button>
            }
            title="Clear all chats?"
            description="This will remove your entire chat history. Are you sure you want to proceed?"
            confirmLabel="Clear"
            onConfirm={handleClearHistory}
          />
        )}
      </div>
      </div>
    </>
  );
};

export default ChatSidebar;

