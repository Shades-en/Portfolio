'use client';

import React, { useState, useEffect } from 'react';
import { Search, Trash2, PanelLeftClose, PanelLeftOpen, PenTool } from 'lucide-react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import ChatListItem from './ChatList';

interface Message {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: Date;
}

interface ChatHistory {
  readonly id: string;
  readonly title: string;
  readonly timestamp: Date;
  readonly isActive?: boolean;
  readonly messages?: readonly Message[];
  readonly starred?: boolean;
}

interface ChatSidebarProps {
  readonly onChatSelect?: (messages: readonly Message[]) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onChatSelect }) => {
  const defaultMessages: readonly Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: '# Hey there! 👋\n\nI\'m your AI assistant. I can help you explore my portfolio, discuss projects, dive into technical skills, and share my experience.\n\n**What would you like to know?**',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'What are your main technical skills?',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '3',
      role: 'assistant',
      content: '## Great question!\n\nI have expertise across multiple domains:\n\n### **AI/ML**\n- HuggingFace, Langchain, OpenAI SDK, Google ADK\n\n### **Backend**\n- FastAPI, Node.js, Django, Flask, Spring Boot\n\n### **Frontend**\n- React.js, Next.js, ThreeJS, HTML/CSS\n\n### **Cloud & Databases**\n- Azure, Kubernetes, Docker, MongoDB, Redis\n\n### **Languages**\n- Python, JavaScript, TypeScript, Java, C, SQL\n\nI\'m particularly passionate about **AI/ML** and **full-stack development**. Want to explore any specific area?',
      timestamp: new Date(Date.now() - 30000),
    },
  ];

  const [chatHistory, setChatHistory] = useState<readonly ChatHistory[]>([
    { id: '1', title: 'Portfolio Optimization Optimization Optimization Optimization', timestamp: new Date(Date.now() - 3600000), isActive: true, messages: defaultMessages, starred: false },
    { id: '2', title: 'AI/ML Technologies', timestamp: new Date(Date.now() - 86400000), starred: true },
    { id: '3', title: 'Project Discussion Technologies Technologies Technologies Technologies', timestamp: new Date(Date.now() - 172800000), starred: true },
    { id: '4', title: 'Backend Architecture', timestamp: new Date(Date.now() - 259200000), starred: false },
    { id: '5', title: 'Frontend Best Practices', timestamp: new Date(Date.now() - 345600000), starred: false },
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [opacityAnimationClasses, setOpacityAnimationClasses] = useState('transition-opacity duration-100 opacity-100');

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredChats = chatHistory.filter(chat => chat.starred);
  const recentChats = chatHistory.filter(chat => !chat.starred);

  const handleNewChat = (): void => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      isActive: true,
      messages: [],
    };
    setChatHistory([newChat, ...chatHistory.map(c => ({ ...c, isActive: false }))]);
    onChatSelect?.([]);
  };

  const handleChatClick = (chat: ChatHistory): void => {
    setChatHistory(chatHistory.map(c => ({ ...c, isActive: c.id === chat.id })));
    onChatSelect?.(chat.messages || []);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setChatHistory(chatHistory.filter(chat => chat.id !== id));
  };

  useEffect(() => {
    const activeChat = chatHistory.find(c => c.isActive);
    if (activeChat) {
      onChatSelect?.(activeChat.messages || []);
    }
  }, []);

  useEffect(() => {
    const prevailingOpacityClass = "transition-opacity duration-100"
    const opacityAnimationClassChange = isCollapsed ? 'opacity-0' : 'opacity-100';
    setOpacityAnimationClasses(prevailingOpacityClass + " " + opacityAnimationClassChange);
  }, [isCollapsed]);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`relative overflow-hidden border-r flex flex-col bg-[var(--chat-foreground)] h-full transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="px-4 pt-4 pb-0 mt-2">
        <div className="flex items-center justify-between gap-3 relative top-0 h-5">
          <div className={`flex items-center gap-3 absolute left-0 ${opacityAnimationClasses}`}>
            <div className="p-0.5 bg-amber-50 rounded-lg flex-shrink-0">
              <Image src="/web-app-manifest.png" alt="Shades Icon" width={28} height={28} className="rounded-md" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Shades</p>
            </div>
          </div>
          <div className="absolute right-0">
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
                title="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            ) : (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
                title="Collapse sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative top-5 left-0 flex-1">
        <div className="w-72 transition-transform duration-300">
          <div className="h-full flex flex-col justify-center">
            <div className="p-4 py-1 border-b border-slate-800 h-24">
              <div className="flex flex-col gap-2 h-full">
                <button onClick={handleNewChat} className="flex items-center gap-3 px-0 py-1.5 text-white hover:text-primary transition-colors duration-200 group">
                  <div className='pl-2'>
                    <PenTool size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className={`text-sm font-medium ${opacityAnimationClasses}`}>New chat</span>
                </button>
                <Dialog.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <Dialog.Trigger asChild>
                    <button className="flex items-center gap-3 px-0 py-1.5 text-white hover:text-primary transition-colors duration-200 group outline-none">
                      <div className='pl-2'> 
                        <Search size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className={`text-sm font-medium ${opacityAnimationClasses}`}>Search chats</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--chat-foreground)] border border-primary/20 rounded-lg shadow-lg z-50 w-2/5 h-2/5 max-h-96 flex flex-col">
                      <div className="p-4 border-b border-slate-800">
                        <Dialog.Title className="text-lg font-semibold text-white mb-3">Search Chats</Dialog.Title>
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search your chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                        {filteredChats.length > 0 ? (
                          filteredChats.map((chat) => (
                            <ChatListItem
                              key={chat.id}
                              chat={chat}
                              isActive={!!chat.isActive}
                              onClick={() => setIsSearchOpen(false)}
                              onDelete={(id, e) => {
                                e.stopPropagation();
                                handleDeleteChat(id, e);
                              }}
                              subtitle={formatTime(chat.timestamp)}
                              variant="search"
                            />
                          ))
                        ) : (
                          <div className="flex items-center justify-center py-8 text-center">
                            <p className="text-sm text-slate-500">No chats found</p>
                          </div>
                        )}
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
            <div 
              className="flex-1 overflow-y-auto no-scrollbar"
              style={{ background: 'linear-gradient(to bottom, hsl(222, 47%, 8%)/0, hsl(222, 47%, 4%))' }}
            >
              <div className={`p-3 px-2 mt-4 ${opacityAnimationClasses}`}>
                <div className='space-y-1.5'>
                  {starredChats.length > 0 && (
                    <>
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Starred</p>
                      </div>
                      {starredChats.map((chat) => (
                        <ChatListItem
                          key={chat.id}
                          chat={chat}
                          isActive={!!chat.isActive}
                          onClick={() => handleChatClick(chat)}
                          onDelete={(id, e) => {
                            e.stopPropagation();
                            handleDeleteChat(id, e);
                          }}
                          showTimestamp
                        />
                      ))}
                    </>
                  )}
                </div>

                <div className='mt-5 space-y-1.5'>
                  {recentChats.length > 0 && (
                    <>
                      <div className={starredChats.length > 0 ? 'mt-3' : ''}>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Recents</p>
                      </div>
                      {recentChats.map((chat) => (
                        <ChatListItem
                          key={chat.id}
                          chat={chat}
                          isActive={!!chat.isActive}
                          onClick={() => handleChatClick(chat)}
                          onDelete={(id, e) => {
                            e.stopPropagation();
                            handleDeleteChat(id, e);
                          }}
                          showTimestamp
                        />
                      ))}
                    </>
                  )}
                </div>
                
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 mb-3 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-700"></div>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">No conversations</p>
                    <p className="text-xs text-slate-500">Start a new chat to begin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-2" style={{ borderColor: 'hsl(197, 92%, 56%)/10' }}>
        {isCollapsed ? (
          <div className="mt-auto w-8 h-8 rounded-lg flex items-center p-0.5 bg-amber-50 justify-center overflow-hidden">
            <Image src="/web-app-manifest.png" alt="Shades" width={32} height={32} className="w-full h-full object-cover rounded-lg" />
          </div>
        ) : (
          <button className={`flex items-center gap-3 px-0 py-1.5 text-slate-400 hover:text-red-500 transition-colors duration-200 group ${opacityAnimationClasses}`}>
            <Trash2 size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm font-medium whitespace-nowrap">Clear history</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

