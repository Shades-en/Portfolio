import React, { useState } from "react";
import { Globe, ChevronDown, ChevronUp } from "lucide-react";
import type { ToolUIPart } from "ai";

interface ToolCallMessageProps {
  readonly toolPart: ToolUIPart;
}

const ToolCallMessage: React.FC<ToolCallMessageProps> = ({ toolPart }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract function name from type (e.g., "tool-get_weather" -> "get_weather")
  const functionName = toolPart.type.replace("tool-", "");
  
  // toolPart.input contains the function arguments
  const args = toolPart.input || {};
  const argEntries = Object.entries(args);
  const hasArgs = argEntries.length > 0;
  const hasMultipleArgs = argEntries.length > 1;
  
  // Check if still streaming
  const isStreaming = toolPart.state === 'input-streaming';

  return (
    <div className="flex gap-3 items-start mb-3 animate-fade-in-up">
      <div className="flex-shrink-0 mt-2.5">
        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Globe size={14} className="text-primary" />
        </div>
      </div>
      <div className="flex-1 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary">{isStreaming ? 'Calling Tool...' : 'Tool Called'}</span>
            <span className="font-mono text-xs text-foreground">{functionName}</span>
            {hasArgs && !isExpanded && (
              <span className="text-xs text-muted-foreground">
                {argEntries[0][0]}: "{String(argEntries[0][1])}"
                {hasMultipleArgs && ` +${argEntries.length - 1} more`}
              </span>
            )}
            {(hasArgs || isExpanded) && (
              <span className="ml-auto flex-shrink-0">
                {isExpanded ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-primary" />}
              </span>
            )}
          </div>
        </button>
        {isExpanded && hasArgs && (
          <div className="text-xs mt-2 space-y-1 pl-2 border-l-2 border-primary/20">
            {argEntries.map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-muted-foreground font-medium text-xs">{key}:</span>
                <span className="text-foreground break-all text-xs">"{String(value)}"</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCallMessage;
