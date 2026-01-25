import React, { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import type { ToolUIPart } from "ai";

interface ToolResponseMessageProps {
  readonly toolPart: ToolUIPart;
}

const ToolResponseMessage: React.FC<ToolResponseMessageProps> = ({ toolPart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if this is an error or success response
  const isError = toolPart.state === 'output-error';
  
  // Get content from output or errorText
  const rawContent = isError ? toolPart.errorText : toolPart.output;
  const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent, null, 2);
  const isLongContent = content.length > 80;
  const previewContent = content.slice(0, 80);

  return (
    <div className="flex gap-3 items-start mb-3 animate-fade-in-up">
      <div className="flex-shrink-0 mt-2.5">
        <div className={`w-6 h-6 rounded-full ${isError ? 'bg-red-500/10 border-red-500/20' : 'bg-accent/10 border-accent/20'} border flex items-center justify-center`}>
          {isError ? (
            <AlertCircle size={14} className="text-red-500" />
          ) : (
            <CheckCircle size={14} className="text-accent" />
          )}
        </div>
      </div>
      <div className={`flex-1 ${isError ? 'bg-red-500/5 border-red-500/10' : 'bg-accent/5 border-accent/10'} border rounded-lg px-3 py-2`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isError ? 'text-red-500' : 'text-accent'}`}>
              {isError ? 'Tool Error' : 'Tool Response'}
            </span>
            <span className="text-xs text-foreground truncate flex-1">
              {isLongContent && !isExpanded ? `${previewContent}...` : content}
            </span>
            {isLongContent && (
              <span className="ml-auto flex-shrink-0">
                {isExpanded ? <ChevronUp size={14} className="text-accent" /> : <ChevronDown size={14} className="text-accent" />}
              </span>
            )}
          </div>
        </button>
        {isExpanded && isLongContent && (
          <div className="text-xs text-foreground mt-2 pl-2 border-l-2 border-accent/20 leading-relaxed">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolResponseMessage;
