'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Paperclip, CircleStop } from 'lucide-react';
import type { ChangeEvent } from 'react';
import RotatingText from '@/components/animation/RotatingText';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useChat } from '@ai-sdk/react';
import { bumpSessionToTop, addNewSession, generateSessionNameRequest, clearPendingSessionName } from '@/store/slices/chatSlice';
import { useSharedChatContext } from '@/app/contexts/chat-context';
import { chatConfig } from '@/config';
import { generateObjectId, getUserCookie } from '@/lib/utils';
import { cancelChatGeneration, renameSession } from '@/lib/api/chat';
import QuickSuggestions from './QuickSuggestions';
import '../chat.css';

interface ChatInputProps {
  readonly newChat?: boolean;
}


const ChatInput: React.FC<ChatInputProps> = ({ 
  newChat = false,
}) => {
  const dispatch = useAppDispatch();
  const { currentSession, pendingSessionName } = useAppSelector((state) => state.chat);
  const { getOrCreateChat } = useSharedChatContext();
  // For new chat, track the generated sessionId so we use the same Chat instance
  const [newChatSessionId, setNewChatSessionId] = useState<string | null>(null);
  // For new chat UI, prefer currentSession if one exists (empty saved session case),
  // otherwise use generated/new session identifiers.
  const sessionIdForChat = newChat
    ? (currentSession?.id ?? newChatSessionId ?? 'new')
    : (currentSession?.id ?? 'new');
  const chat = getOrCreateChat(sessionIdForChat);
  const { status, stop } = useChat({ chat });
  const isStreaming = status === 'streaming' || status === 'submitted';
  // isBusy is true when the current session's Chat instance is streaming
  // This works correctly when switching sessions because each session has its own Chat instance
  const isBusy = isStreaming;
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showNewChatUI, setShowNewChatUI] = useState(newChat);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    setShowNewChatUI(newChat);
  }, [newChat]);

  // Persist pending session name to DB when streaming completes
  useEffect(() => {
    const wasStreaming = prevStatusRef.current === 'streaming' || prevStatusRef.current === 'submitted';
    const isNowReady = status === 'ready';

    if (wasStreaming && isNowReady) {
      if (pendingSessionName) {
        void renameSession(pendingSessionName.sessionId, pendingSessionName.name);
        dispatch(clearPendingSessionName());
      }
    }

    prevStatusRef.current = status;
  }, [status, pendingSessionName, dispatch]);

  const handleClick = (): void => {
    if (isBusy) {
      stop();
      if (currentSession?.id) {
        void cancelChatGeneration(currentSession.id);
      }
    } else {
      void handleSend();
    }
  };

  const handleSend = async (): Promise<void> => {
    setMessage('');
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isBusy) {
      return;
    }

    let sessionId = currentSession?.id;
    let chatToUse = chat;

    const shouldCreateNewSession = newChat && !currentSession?.id;
    if (shouldCreateNewSession) {
      // Generate sessionId and update state so we use the same Chat instance
      sessionId = newChatSessionId ?? generateObjectId();
      if (!newChatSessionId) {
        setNewChatSessionId(sessionId);
        // Get the Chat instance for the new sessionId immediately (before state updates)
        chatToUse = getOrCreateChat(sessionId);
        dispatch(addNewSession({ sessionId, name: 'New Chat' }));
        // Use replaceState to update URL without full page navigation
        // This preserves the AI SDK chat context and avoids server-side fetch for non-existent session
        globalThis.history.replaceState(null, '', `/chat/${sessionId}`);
      }
    } else if (sessionId) {
      dispatch(bumpSessionToTop({ sessionId }));
    }

    const userCookie = getUserCookie();
    
    // Dispatch name generation request in parallel with sending message
    // For new chats, always generate name. For existing chats, saga checks turn number.
    const turnNumber = currentSession?.latest_turn_number ?? 0;
    dispatch(generateSessionNameRequest({
      sessionId: sessionId ?? null,
      query: trimmedMessage,
      isNewSession: newChat,
      turnNumber: turnNumber + 1, // Next turn number after this message
    }));

    // Use chatToUse.sendMessage directly for new chats to ensure correct Chat instance
    await chatToUse.sendMessage(
      { text: trimmedMessage },
      {
        body: {
          user_cookie: userCookie,
          session_id: sessionId,
        }
      }
    );
    setShowSuggestions(false);
    setShowNewChatUI(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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


  // Use CSS responsive classes instead of JS-based isMobile to prevent hydration shift
  // sm: breakpoint (640px) matches the mobile breakpoint
  const newChatClasses = 'w-9/12 lg:5/6 mx-auto absolute inset-x-0 top-1/2 -translate-y-[55%] sm:-translate-y-[65%] transform';
  const existingChatClasses = 'w-11/12 mx-auto';
  const containerClasses = `space-y-4 ${showNewChatUI ? newChatClasses : existingChatClasses}`;

  return (
    <div data-chat-input className={containerClasses}>
      {showNewChatUI && (
        <div className='flex items-center gap-2 w-full justify-center my-10 sm:flex-row flex-col'>
          <h1 className="xl:text-4xl sm:text-3xl text-3xl font-light whitespace-nowrap">{"Let's talk about"}</h1>
          <RotatingText
            texts={[...chatConfig.questionTopics]}
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
                  void handleSend();
                }
              }}
              placeholder="What would you like to know?"
              className="w-full bg-transparent px-2 pt-2 text-foreground placeholder-muted-foreground resize-none outline-none leading-6 max-h-[384px] overflow-y-auto"
              rows={1}
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
            {isBusy ? (
              <button
                onClick={handleClick}
                className="shrink-0 h-9 w-9 grid place-items-center rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                title="Stop generating"
                type="button"
              >
                <CircleStop size={18} color='red'/>
              </button>
            ) : (
              <button
                onClick={handleClick}
                disabled={!message.trim()}
                className="shrink-0 h-9 w-9 grid place-items-center rounded-xl bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-background transition-all hover:shadow-lg hover:shadow-primary/50 disabled:shadow-none"
                title='Send message'
                type="button"
              >
                <ArrowUpRight size={18} />
              </button>
            )}
          </div>
        </div>
        {showNewChatUI && showSuggestions && (
          <QuickSuggestions onSelect={(suggestion) => {
            setMessage(suggestion);
            setShowSuggestions(false);
          }} />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
