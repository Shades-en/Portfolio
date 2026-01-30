import React from "react";
import type { Message } from '@/types/chat';
import HumanMessage from './HumanMessage';
import AIMessage from './AIMessage';

interface ChatMessageItemProps {
  readonly message: Message;
  readonly isStreaming?: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isStreaming = false}) => {
  if (message.role === 'user') {
    return <HumanMessage message={message} />;
  }
  
  if (message.role === 'assistant') {
    return <AIMessage message={message} />;
  }
  
  return null;
};

export default React.memo(ChatMessageItem, (prevProps, nextProps) => {
  // Always re-render if streaming the current message
  if (nextProps.isStreaming) {
    return false;
  }
  // For completed messages, only re-render if message ID changes
  return prevProps.message.id === nextProps.message.id;
});
