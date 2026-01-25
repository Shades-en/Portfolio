import React from "react";
import type { Message } from '@/types/chat';
import HumanMessage from './HumanMessage';
import AIMessage from './AIMessage';
import ToolMessage from './ToolMessage';

interface ChatMessageItemProps {
  readonly message: Message;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  if (message.role === 'user') {
    return <HumanMessage message={message} />;
  }
  
  if (message.role === 'assistant') {
    return <AIMessage message={message} />;
  }
  
  return null;
};

export default ChatMessageItem;
