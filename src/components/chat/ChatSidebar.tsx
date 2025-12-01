'use client';

import React, { useState } from 'react';
import { Search, Trash2, PanelLeftClose, PanelLeftOpen, PenTool } from 'lucide-react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';

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
    { id: '1', title: 'Portfolio Optimization Optimization Optimization Optimization', timestamp: new Date(Date.now() - 3600000), isActive: true, messages: defaultMessages },
    { id: '2', title: 'AI/ML Technologies', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Project Discussion Technologies Technologies Technologies Technologies', timestamp: new Date(Date.now() - 172800000) },
    { id: '4', title: 'Backend Architecture', timestamp: new Date(Date.now() - 259200000) },
    { id: '5', title: 'Frontend Best Practices', timestamp: new Date(Date.now() - 345600000) },
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  React.useEffect(() => {
    const activeChat = chatHistory.find(c => c.isActive);
    if (activeChat) {
      onChatSelect?.(activeChat.messages || []);
    }
  }, []);

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
      className={`relative overflow-hidden border-r flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      style={{
        background: 'linear-gradient(to bottom, hsl(190, 50%, 9%), hsl(190, 55%, 4%))',
        borderColor: 'hsl(197, 92%, 56%)/10',
      }}
    >
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'hsl(197, 92%, 56%)/10' }}>
        <div className={`flex items-center justify-between gap-3 mb-2 ${isCollapsed ? 'invisible' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="p-0.5 bg-amber-50 rounded-lg flex-shrink-0">
              <Image src="/web-app-manifest.png" alt="Shades Icon" width={28} height={28} className="rounded-md" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Shades</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
      </div>

      {isCollapsed && (
        <div className="absolute inset-0 z-20 pointer-events-auto">
          <div className="h-full w-full flex flex-col items-center p-4">
            <button
              onClick={() => setIsCollapsed(false)}
              className="pt-4 pb-3 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 mb-2"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
            <button
              onClick={handleNewChat}
              className="mt-3 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200"
              title="New Chat"
            >
              <PenTool size={18} />
            </button>
            <button className="mt-2 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200" title="Search">
              <Search size={18} />
            </button>
            <div className="mt-auto w-8 h-8 rounded-lg flex items-center p-0.5 bg-amber-50 justify-center overflow-hidden">
              <Image src="/web-app-manifest.png" alt="Shades" width={32} height={32} className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      )}

      <div className="relative flex-1">
        <div className={`absolute inset-0 w-72 transition-transform duration-300 ${isCollapsed ? '-translate-x-full pointer-events-none' : 'translate-x-0 pointer-events-auto'}`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-800 h-24">
              <div className="flex flex-col gap-2 h-full">
                <button onClick={handleNewChat} className="flex items-center gap-3 px-0 py-1.5 text-white hover:text-primary transition-colors duration-200 group">
                  <PenTool size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">New chat</span>
                </button>
                <Dialog.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <Dialog.Trigger asChild>
                    <button className="flex items-center gap-3 px-0 py-1.5 text-white hover:text-primary transition-colors duration-200 group outline-none">
                      <Search size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Search chats</span>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary/95 border border-primary/20 rounded-lg shadow-lg z-50 w-96 max-h-96 flex flex-col">
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
                            <button
                              key={chat.id}
                              onClick={() => setIsSearchOpen(false)}
                              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/60 border border-transparent hover:border-slate-600 transition-all duration-200 relative"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate font-medium">{chat.title}</p>
                                <p className="text-xs text-slate-500">{formatTime(chat.timestamp)}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat.id, e);
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
                                title="Delete"
                                type="button"
                              >
                                <Trash2 size={12} className="text-red-500" />
                              </button>
                            </button>
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
              <div className="space-y-1.5 p-3 px-2">
              {chatHistory.length > 0 ? (
                  chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group relative flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${
                        chat.isActive
                          ? 'bg-slate-700/60 border border-slate-600 shadow-lg shadow-slate-900'
                          : 'hover:bg-slate-800/40 border border-transparent hover:border-slate-700'
                      }`}
                    >
                      <button onClick={() => handleChatClick(chat)} className="flex-1 min-w-0 text-left bg-transparent focus:outline-none" type="button">
                        <div className="relative min-w-0">
                          <p
                            className="text-sm text-white truncate whitespace-nowrap font-medium leading-tight"
                            style={{
                              WebkitMaskImage:
                                'linear-gradient(to right, #000 0%, #000 calc(100% - 2.5rem), rgba(0,0,0,0.45) calc(100% - 2rem), rgba(0,0,0,0.15) calc(100% - 1rem), transparent 100%)',
                              maskImage:
                                'linear-gradient(to right, #000 0%, #000 calc(100% - 2.5rem), rgba(0,0,0,0.45) calc(100% - 2rem), rgba(0,0,0,0.15) calc(100% - 1rem), transparent 100%)',
                              WebkitMaskRepeat: 'no-repeat',
                              maskRepeat: 'no-repeat',
                            }}
                          >
                            {chat.title}
                          </p>
                        </div>
                      </button>
                      <div className="w-10 flex items-center justify-end flex-shrink-0">
                        <p className="text-xs leading-none h-4 flex items-center text-slate-500 whitespace-nowrap group-hover:hidden group-focus-within:hidden">
                          {formatTime(chat.timestamp)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id, e);
                          }}
                          className="ml-1 inline-flex h-4 w-4 p-0 items-center justify-center hover:bg-red-900/30 rounded transition-colors duration-200 hidden group-hover:inline-flex group-focus-within:inline-flex"
                          title="Delete"
                          type="button"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
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

      {!isCollapsed && (
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'hsl(197, 92%, 56%)/10' }}>
          <button className="flex items-center gap-3 px-0 py-1.5 text-slate-400 hover:text-red-500 transition-colors duration-200 group">
            <Trash2 size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm font-medium">Clear history</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;

