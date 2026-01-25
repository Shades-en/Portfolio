import React from "react";
import ToolCallMessage from './ToolCallMessage';
import ToolResponseMessage from './ToolResponseMessage';
import type { ToolUIPart } from "ai";

interface ToolMessageProps {
  readonly toolPart: ToolUIPart;
}

const ToolMessage: React.FC<ToolMessageProps> = ({ toolPart }) => {
  // Check if this is a tool part (type starts with "tool-")
  if (!toolPart.type?.startsWith('tool-')) {
    return null;
  }
  
  const hasOutput = toolPart.state === 'output-available' || toolPart.state === 'output-error';
  const hasInput = toolPart.state === 'input-available' || toolPart.state === 'input-streaming';
  
  return (
    <>
      {(hasInput || hasOutput) && <ToolCallMessage toolPart={toolPart} />}
      {hasOutput && <ToolResponseMessage toolPart={toolPart} />}
    </>
  );
};

export default ToolMessage;
