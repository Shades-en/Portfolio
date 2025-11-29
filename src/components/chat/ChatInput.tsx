'use client';

import React, { useState } from 'react';
import { Send, Paperclip, Plus } from 'lucide-react';
import type { ChangeEvent } from 'react';
import './chat-input.css';

interface ChatInputProps {
  readonly onSendMessage?: (message: string) => void;
  readonly isLoading?: boolean;
}

const QUICK_SUGGESTIONS = [
  'Tell me about your projects',
  'What\'s your experience with AI/ML?',
  'Show me your tech stack',
  'How can I contact you?',
];

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  isLoading = false 
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = (): void => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage('');
      setShowSuggestions(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSuggestion = (suggestion: string): void => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = (): void => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 432;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };


  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Quick Suggestions */}
        {showSuggestions && !message && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in-up">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/20 bg-secondary/30 hover:bg-primary/10 text-foreground text-sm transition-all duration-200 hover:border-primary/50 group"
              >
                <Plus size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-left">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message me anything..."
            className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-primary/20 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-primary/50 focus:bg-secondary/60 focus:shadow-lg focus:shadow-primary/20 transition-all duration-200 overflow-y-hidden hover:overflow-y-auto"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '40px', maxHeight: '432px' }}
          />
          <div className="flex items-center justify-between">
            <button
              className="flex-shrink-0 p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
              title="Attach file"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="flex-shrink-0 p-2 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-background transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

