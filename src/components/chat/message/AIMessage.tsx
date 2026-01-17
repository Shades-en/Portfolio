import React, { useState } from "react";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Streamdown } from "streamdown";
import type { Message } from '@/types/chat';
import '../chat.css';

interface AIMessageProps {
  readonly message: Message;
  readonly isLastAIInTurn: boolean;
}

const AIMessage: React.FC<AIMessageProps> = ({ message, isLastAIInTurn }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = (): void => {
    navigator.clipboard.writeText(message.content);
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
    <div className={`flex gap-6 animate-fade-in-up group relative justify-start ${isLastAIInTurn ? 'mb-12' : 'mb-4'}`}>
      <div className="flex flex-col gap-1 max-w-2xl items-start">
        <div className="px-3 py-2 rounded-2xl transition-all duration-200 backdrop-blur-sm text-foreground rounded-bl-none">
          <div className="text-sm leading-relaxed prose prose-invert max-w-none chat-ai-markdown">
            <Streamdown shikiTheme={["dracula", "dracula"]}>{message.content}</Streamdown>
          </div>
        </div>

        {isLastAIInTurn && (
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
        )}
      </div>
    </div>
  );
};

export default AIMessage;
