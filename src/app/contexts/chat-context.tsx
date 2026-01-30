'use client';

import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { serverConfig } from '@/config';
import { Message } from '@/types/chat';

function generateHexId(length = 24): string {
  const byteLength = Math.ceil(length / 2);
  const bytes = new Uint8Array(byteLength);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < byteLength; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}

interface ChatContextValue {
  // replace with your custom message type
  chat: Chat<Message>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat() {
  return new Chat<Message>({
    transport: new DefaultChatTransport({
      api: `${serverConfig.backendApiUrl}/chat/stream`,
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
            id: generateHexId(),
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
  const [chat, setChat] = useState(() => createChat());

  const value = useMemo(() => ({ chat }), [chat]);

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