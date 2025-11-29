'use client';

import React from 'react';
import { Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

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
      content: 'Hey there! 👋 I\'m your AI assistant. I can help you explore my portfolio, discuss projects, dive into technical skills, and share my experience. What would you like to know?',
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
      content: 'Great question! I have expertise across multiple domains:\n\n**AI/ML** - HuggingFace, Langchain, OpenAI SDK, Google ADK\n**Backend** - FastAPI, Node.js, Django, Flask, Spring Boot\n**Frontend** - React.js, Next.js, ThreeJS, HTML/CSS\n**Cloud & Databases** - Azure, Kubernetes, Docker, MongoDB, Redis\n**Languages** - Python, JavaScript, TypeScript, Java, C, SQL\n\nI\'m particularly passionate about AI/ML and full-stack development. Want to explore any specific area?',
      timestamp: new Date(Date.now() - 30000),
    },
  ]
}) => {
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
            <div
              key={message.id}
              className={`flex gap-4 animate-fade-in-up ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >

              <div className={`flex flex-col gap-1 max-w-2xl ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div
                  className={`px-4 py-3 rounded-2xl transition-all duration-200 backdrop-blur-md ${
                    message.role === 'user'
                      ? 'rounded-br-none'
                      : 'text-foreground rounded-bl-none'
                  }`}
                  style={message.role === 'user' ? { background: 'linear-gradient(to bottom, hsla(190, 50%, 32%, 0.8), hsla(190, 55%, 20%, 0.4))', color: 'hsl(210, 40%, 98%)' } : {}}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-3 px-1 mt-2">
                    <div className="relative group">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <Copy size={16} />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Copy message
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp size={16} />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Good response
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsDown size={16} />
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Bad response
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
