import React, { useState } from "react";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Streamdown } from "streamdown";
import type { Message } from '@/types/chat';
import ToolMessage from './ToolMessage';
import '../chat.css';

interface AIMessageProps {
  readonly message: Message;
}

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = (): void => {
    // Extract all text content from parts
    const textContent = message.parts
      ?.filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('\n') || '';
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (): void => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = (): void => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="flex gap-6 animate-fade-in-up group relative justify-start mb-12">
      <div className="flex flex-col gap-1 max-w-2xl items-start">
        {message.parts.map((part: any, index: number) => {
          if (part.type === 'text') {
            return (
              <div key={`${message.id}-text-${index}`} className="px-3 py-2 rounded-2xl transition-all duration-200 backdrop-blur-sm text-foreground rounded-bl-none">
                <div className="text-sm leading-relaxed prose prose-invert max-w-none chat-ai-markdown">
                  <Streamdown shikiTheme={["tokyo-night", "tokyo-night"]}>{part.text}</Streamdown>
                </div>
              </div>
            );
          } else if (part.type?.startsWith('tool-')) {
            return <ToolMessage key={`${message.id}-tool-${index}`} toolPart={part} />;
          }
          return null;
        })}
        

        <div className="flex items-center gap-3 px-1 mt-2">
          <CustomTooltip content="Copy message">
            <button 
              onClick={handleCopy}
              className={`p-2 rounded-lg sm:hover:bg-primary/10 transition-colors ${copied ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </CustomTooltip>
          
          {!disliked && (
            <CustomTooltip content="Good response">
              <button 
                onClick={handleLike}
                className={`p-2 rounded-lg sm:hover:bg-primary/10 transition-colors ${liked ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
              >
                <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </CustomTooltip>
          )}
          
          {!liked && (
            <CustomTooltip content="Bad response">
              <button 
                onClick={handleDislike}
                className={`p-2 rounded-lg sm:hover:bg-primary/10 transition-colors ${disliked ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
              >
                <ThumbsDown size={16} fill={disliked ? 'currentColor' : 'none'} />
              </button>
            </CustomTooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
