import React, { useState } from "react";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { User, Edit, Copy, Check } from "lucide-react";
import type { Message } from '@/types/chat';

interface HumanMessageProps {
  readonly message: Message;
}

const HumanMessage: React.FC<HumanMessageProps> = ({ message }) => {
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEdit = (): void => {
    setEdited(true);
    setTimeout(() => setEdited(false), 2000);
  };

  const handleCopy = (): void => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-4 animate-fade-in-up group relative justify-end mb-10">
      <div className="flex flex-col gap-1 max-w-2xl items-end">
        <div
          className="px-3 py-2 rounded-2xl transition-all duration-200 backdrop-blur-sm rounded-br-none"
          style={{
            background: 'var(--chat-message)',
            color: "hsl(210, 40%, 98%)",
            border: '1px solid hsl(var(--primary) / 0.12)'
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
          <User size={18} className="text-primary" />
        </div>
      </div>
      
      <div className="absolute top-full right-12 mt-1 flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-auto sm:pointer-events-none sm:group-hover:pointer-events-auto z-50">
        <CustomTooltip content="Copy message" side="bottom">
          <button 
            onClick={handleCopy}
            className={`p-1.5 rounded-lg sm:hover:bg-primary/10 transition-colors pointer-events-auto ${copied ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </CustomTooltip>

        <CustomTooltip content="Edit message" side="bottom">
          <button 
            onClick={handleEdit}
            className="p-1.5 rounded-lg sm:hover:bg-primary/10 text-muted-foreground sm:hover:text-primary transition-colors pointer-events-auto"
          >
            <Edit size={14} />
          </button>
        </CustomTooltip>
      </div>
    </div>
  );
};

export default HumanMessage;
