'use client';

import React, { createContext, useContext, ReactNode, useRef, useCallback, useMemo } from 'react';
import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Message } from '@/types/chat';
import { chatConfig } from '@/config';

interface ChatContextValue {
  getOrCreateChat: (sessionId: string) => Chat<Message>;
  deleteChat: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat(): Chat<Message> {
  return new Chat<Message>({
    transport: new DefaultChatTransport({
      api: '/api/chat/stream',
      prepareSendMessagesRequest({
        messages,
        id,
        body,
        ...rest
      }) {
        const lastMessage = messages.at(-1);
        const textPart = lastMessage?.parts?.find(
          (part): part is { type: 'text'; text: string } =>
            part.type === 'text' && typeof (part as { text?: unknown }).text === 'string',
        );
        const customBody = (body ?? {}) as Record<string, unknown> & {
          query_message?: Record<string, unknown>;
        };

        const mergedBody = {
          ...customBody,
          query_message: {
            query: textPart?.text ?? '',
          },
          provider_options: {
            api_type: chatConfig.response.apiType,
          },
        };

        return {
          ...rest,
          body: mergedBody,
        };
      },
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatMapRef = useRef<Map<string, Chat<Message>>>(new Map());

  const getOrCreateChat = useCallback((sessionId: string): Chat<Message> => {
    const existingChat = chatMapRef.current.get(sessionId);
    if (existingChat) {
      return existingChat;
    }
    const newChat = createChat();
    chatMapRef.current.set(sessionId, newChat);
    return newChat;
  }, []);

  const deleteChat = useCallback((sessionId: string): void => {
    chatMapRef.current.delete(sessionId);
  }, []);

  const value = useMemo(() => ({ getOrCreateChat, deleteChat }), [getOrCreateChat, deleteChat]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useSharedChatContext must be used within a ChatProvider');
  }
  return context;
}