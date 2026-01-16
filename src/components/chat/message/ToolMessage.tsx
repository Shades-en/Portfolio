import React from "react";
import type { Message } from '@/types/chat';
import ToolCallMessage from './ToolCallMessage';
import ToolResponseMessage from './ToolResponseMessage';

interface ToolMessageProps {
  readonly message: Message;
  readonly isAIToolCall?: boolean;
}

const ToolMessage: React.FC<ToolMessageProps> = ({ message, isAIToolCall = false }) => {
  if (isAIToolCall) {
    return <ToolCallMessage message={message} />;
  }

  return <ToolResponseMessage message={message} />;
};

export default ToolMessage;
