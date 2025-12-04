'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Paperclip, Plus } from 'lucide-react';
import type { ChangeEvent } from 'react';
import RotatingText from '@/components/animation/RotatingText';
import './chat.css';

interface ChatInputProps {
  readonly onSendMessage?: (message: string) => void;
  readonly isLoading?: boolean;
  readonly newChat?: boolean;
  readonly userName?: string;
  readonly isMobile?: boolean;
}

const QUICK_SUGGESTIONS = [
  'Tell me about your projects',
  'What\'s your experience with AI/ML?',
  'Show me your tech stack',
  'How can I contact you?',
];

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  isLoading = false,
  newChat = false,
  userName = 'there',
  isMobile = false
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const questionTopics = [
    'who I am',
    'my projects',
    'my experience',
    'my skills',
    'my accomplishments'
  ]

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

  const handleAttachClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (_e: ChangeEvent<HTMLInputElement>): void => {
    // hook for future file handling
  };


  return (
    <div className={`w-11/12 lg:5/6 mx-auto space-y-4 absolute ${newChat ? `inset-x-0 top-1/2 ${isMobile? '-translate-y-[55%]': '-translate-y-[65%]'} transform` : 'bottom-2 left-0 right-0'}`}>
      {newChat && (
        <div className='flex items-center gap-2 w-full justify-center my-10 sm:flex-row flex-col'>
          <h1 className="xl:text-4xl sm:text-3xl text-3xl font-light whitespace-nowrap"> Let's talk about</h1>
          <RotatingText
            texts={questionTopics}
            mainClassName="px-2 sm:px-2 md:px-2 xl:text-3xl sm:text-3xl text-3xl transition-all duration-1000 font-regular bg-primary/90 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitBy='words'
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400, duration: 0.5 }}
            rotationInterval={2000}
          />
        </div>
      )}
      <div className='w-full sm:w-2/3 xl:w-3/5 mx-auto'>
        <div className="px-4 py-3 rounded-[20px] sm:rounded-[25px] h-fit border border-primary/20 bg-[var(--chat-foreground)] focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/20 transition-all flex flex-col">
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
          <div>
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
              placeholder="What would you like to know?"
              className="w-full bg-transparent px-2 pt-2 text-foreground placeholder-muted-foreground resize-none outline-none leading-6 max-h-[384px] overflow-y-auto"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleAttachClick}
              className="shrink-0 h-9 w-9 grid place-items-center rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
              title="Attach file"
              type="button"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="shrink-0 h-9 w-9 grid place-items-center rounded-xl bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-background transition-all hover:shadow-lg hover:shadow-primary/50 disabled:shadow-none"
              title="Send message"
              type="button"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
        {/* Quick Suggestions */}
        {showSuggestions && newChat && (
          <div className="grid grid-cols-1 sm:place-items-start place-items-center sm:grid-cols-2 gap-2 flex w-full justify-center sm:mt-2 mt-10">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="flex items-center sm:justify-start justify-center gap-2 w-fit mx-4 my-3 text-foreground text-sm transition-all duration-200 hover:border-primary/50 group"
              >
                <Plus size={16} className="text-primary w-4 h-4 flex-shrink-0" />
                <span className="text-center sm:text-left hover:text-primary transition-colors duration-200">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;

