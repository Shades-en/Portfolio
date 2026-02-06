import React, { useState } from "react";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Copy, ThumbsUp, ThumbsDown, Check, AlertCircle } from "lucide-react";
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

  const isMessageReady = (message: Message): boolean => {
    if (!message.parts?.length) {
      return false;
    }
    const lastPart = message.parts.at(-1) as { state?: string } | undefined;
    if (lastPart?.state === undefined) {
      return true;
    }
    return lastPart.state === 'done';
  };

  const isErrorMessage = (message as any).metadata?.error === true;

  if (isErrorMessage) {
    const textPart = message.parts?.find((part: any) => part.type === 'text') as { text?: string } | undefined;
    const errorText = textPart?.text || 'An error occurred';
    return (
      <div className="flex gap-6 animate-fade-in-up group relative justify-start mb-12 w-full overflow-hidden">
        <div className="flex flex-col gap-1 max-w-full items-start overflow-hidden">
          <div className="px-4 py-3 rounded-2xl transition-all duration-200 backdrop-blur-sm rounded-bl-none w-full overflow-hidden border border-red-500/30 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed text-red-200">
                {errorText}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lastPart = message.parts?.at(-1) as { type?: string } | undefined;
  const endsWithToolCall = lastPart?.type?.startsWith('tool-');
  
  return (
    <div className={`flex gap-6 animate-fade-in-up group relative justify-start w-full overflow-hidden ${endsWithToolCall ? 'mb-4' : 'mb-12'}`}>
      <div className="flex flex-col gap-1 max-w-full items-start overflow-hidden">
        {message.parts.map((part: any, index: number) => {
          if (part.type === 'text') {
            const isStreaming = part.state === 'streaming';
            return (
              <div key={`${message.id}-text-${index}`} className="px-3 py-2 rounded-2xl transition-all duration-200 backdrop-blur-sm text-foreground rounded-bl-none w-full overflow-hidden">
                <div className="text-sm leading-relaxed prose prose-invert max-w-none chat-ai-markdown overflow-x-auto">
                  <Streamdown 
                    shikiTheme={["github-dark", "github-dark"]} 
                    mode={isStreaming ? "streaming" : "static"}
                  >
                    {part.text}
                  </Streamdown>
                </div>
              </div>
            );
          } else if (part.type?.startsWith('tool-')) {
            return <ToolMessage key={`${message.id}-tool-${index}`} toolPart={part} />;
          }
          return null;
        })}
        

        { isMessageReady(message) && (
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
