import React, { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Message } from '@/types/chat';

interface ToolResponseMessageProps {
  readonly message: Message;
}

const ToolResponseMessage: React.FC<ToolResponseMessageProps> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = message.content || '';
  const isLongContent = content.length > 80;
  const previewContent = content.slice(0, 80);

  return (
    <div className="flex gap-3 items-start mb-3 animate-fade-in-up">
      <div className="flex-shrink-0 mt-2.5">
        <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <CheckCircle size={14} className="text-accent" />
        </div>
      </div>
      <div className="flex-1 bg-accent/5 border border-accent/10 rounded-lg px-3 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-accent">Tool Response</span>
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
