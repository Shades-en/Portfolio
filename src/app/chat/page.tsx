'use client';

import React, { useState, useEffect } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';

interface Message {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: Date;
}

export default function ChatPage(): React.ReactElement {
  // Use a fixed base timestamp to keep SSR and CSR output identical
  const BASE_TS: number = Date.UTC(2024, 0, 1, 12, 0, 0); // 2024-01-01T12:00:00.000Z
  const messages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: '# Hey there! 👋\n\nI\'m your AI assistant. I can help you explore my portfolio, discuss projects, dive into technical skills, and share my experience.\n\n**What would you like to know?**',
      timestamp: new Date(BASE_TS),
    },
    {
      id: '2',
      role: 'user',
      content: 'What are your main technical skills?',
      timestamp: new Date(BASE_TS - 60000),
    },
    {
      id: '3',
      role: 'assistant',
      content: '## Great question!\n\nI have expertise across multiple domains:\n\n### **AI/ML**\n- HuggingFace, Langchain, OpenAI SDK, Google ADK\n\n### **Backend**\n- FastAPI, Node.js, Django, Flask, Spring Boot\n\n### **Frontend**\n- React.js, Next.js, ThreeJS, HTML/CSS\n\n### **Cloud & Databases**\n- Azure, Kubernetes, Docker, MongoDB, Redis\n\n### **Languages**\n- Python, JavaScript, TypeScript, Java, C, SQL\n\nI\'m particularly passionate about **AI/ML** and **full-stack development**. Want to explore any specific area?',
      timestamp: new Date(BASE_TS - 30000),
    },
    {
      id: '4',
      role: 'user',
      content: 'What are your main technical skills?',
      timestamp: new Date(BASE_TS - 60000),
    },
    {
      id: '5',
      role: 'assistant',
      content: '## Great question!\n\nI have expertise across multiple domains:\n\n### **AI/ML**\n- HuggingFace, Langchain, OpenAI SDK, Google ADK\n\n### **Backend**\n- FastAPI, Node.js, Django, Flask, Spring Boot\n\n### **Frontend**\n- React.js, Next.js, ThreeJS, HTML/CSS\n\n### **Cloud & Databases**\n- Azure, Kubernetes, Docker, MongoDB, Redis\n\n### **Languages**\n- Python, JavaScript, TypeScript, Java, C, SQL\n\nI\'m particularly passionate about **AI/ML** and **full-stack development**. Want to explore any specific area?',
      timestamp: new Date(BASE_TS - 30000),
    },
  ];

  const [activeMessages, setActiveMessages] = useState<Message[]>(messages);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Detect tablet/smaller viewport (<950px) and initialize collapsed state
  useEffect(() => {
    const handleResize = (): void => {
      const tablet = globalThis.window !== undefined && globalThis.window.innerWidth < 950 && globalThis.window.innerWidth >= 640;
      const mobile = globalThis.window !== undefined && globalThis.window.innerWidth < 640;
      setIsTablet(tablet);
      setIsMobile(mobile);
    };
    handleResize();
    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, []);

  // Default to collapsed on tablet/mobile viewports
  useEffect(() => {
    if (isTablet || isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isTablet, isMobile]);

  return (
    <div className="h-[100dvh] flex overflow-hidden w-full" style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
      <ChatSidebar
        onChatSelect={setActiveMessages}
        messages={messages}
        isTablet={isTablet}
        isMobile={isMobile}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col bg-[image:var(--chat-background-alt)] min-h-0 relative overflow-hidden">
        <ChatHeader
          onDeleteChat={() => setActiveMessages([])}
          isTablet={isTablet}
          isMobile={isMobile}
          onMenuClick={() => setSidebarCollapsed(false)}
          newChat={activeMessages.length === 0}
        />
        <ChatMessages messages={activeMessages} isMobile={isMobile}/>
      </div>
    </div>
  );
}
