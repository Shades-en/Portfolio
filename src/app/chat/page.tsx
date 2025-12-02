'use client';

import React, { useState } from 'react';
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
  const messages: Message[] = [
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
    {
      id: '4',
      role: 'user',
      content: 'What are your main technical skills?',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '5',
      role: 'assistant',
      content: '## Great question!\n\nI have expertise across multiple domains:\n\n### **AI/ML**\n- HuggingFace, Langchain, OpenAI SDK, Google ADK\n\n### **Backend**\n- FastAPI, Node.js, Django, Flask, Spring Boot\n\n### **Frontend**\n- React.js, Next.js, ThreeJS, HTML/CSS\n\n### **Cloud & Databases**\n- Azure, Kubernetes, Docker, MongoDB, Redis\n\n### **Languages**\n- Python, JavaScript, TypeScript, Java, C, SQL\n\nI\'m particularly passionate about **AI/ML** and **full-stack development**. Want to explore any specific area?',
      timestamp: new Date(Date.now() - 30000),
    },
  ];

  const [activeMessages, setActiveMessages] = useState<Message[]>(messages);

  return (
    <div className="h-screen flex overflow-hidden w-full" style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
      <ChatSidebar onChatSelect={setActiveMessages} messages={messages} />
      <div className="flex-1 flex flex-col bg-[image:var(--chat-background-alt)] min-h-0 relative">
        <ChatHeader onDeleteChat={() => setActiveMessages([])} />
        <ChatMessages messages={activeMessages} />
      </div>
    </div>
  );
}
