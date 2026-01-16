import React from "react";
import type { Message } from '@/types/chat';
import HumanMessage from './HumanMessage';
import AIMessage from './AIMessage';
import ToolMessage from './ToolMessage';

interface ChatMessageItemProps {
  readonly message: Message;
  readonly isLastAIInTurn?: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isLastAIInTurn = false }) => {
  const isAIToolCall = message.role === "ai" && 
    typeof message?.tool_call_id === "string" && 
    message.tool_call_id !== "null" && 
    message.tool_call_id !== "";
  if (message.role === 'human') {
    return <HumanMessage message={message} />;
  }
  
  if (!isAIToolCall && message.role === 'ai') {
    return <AIMessage message={message} isLastAIInTurn={isLastAIInTurn} />;
  }
  
  if (message.role === 'tool' || isAIToolCall) {
    return <ToolMessage message={message} isAIToolCall={isAIToolCall} />;
  }
  
  return null;
};

export default ChatMessageItem;
