'use client';

import React, { useEffect, useRef } from 'react';
import { Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ChatMessageItem from './ChatMessageItem';

interface Message {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: Date;
}

interface ChatMessagesProps {
  readonly messages?: readonly Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages = [
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
  ],
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 mx-auto">
                <Bot size={32} className="text-background" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Start a conversation</h2>
            <p className="text-muted-foreground max-w-md">Ask me anything about my portfolio, projects, skills, or experience. I\'m here to help!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
