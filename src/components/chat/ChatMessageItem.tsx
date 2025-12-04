import React, { useState } from "react";
import { User, Copy, ThumbsUp, ThumbsDown, Edit, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import './chat.css';

interface Message {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly timestamp: Date;
}

interface ChatMessageItemProps {
  readonly message: Message;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [edited, setEdited] = useState(false);

  const handleCopy = (): void => {
    console.log("Copy clicked ", message.content)
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

  const handleEdit = (): void => {
    setEdited(true);
    setTimeout(() => setEdited(false), 2000);
  };
  return (
    <div
      className={`flex gap-4 animate-fade-in-up group relative ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col gap-1 max-w-2xl ${
          message.role === "user" ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-3 py-2 rounded-2xl transition-all duration-200 backdrop-blur-sm ${
            message.role === "user"
              ? "rounded-br-none"
              : "text-foreground rounded-bl-none"
          }`}
          style={
            message.role === "user"
              ? {
                  background: 'var(--chat-message)',
                  color: "hsl(210, 40%, 98%)",
                  border: '1px solid hsl(var(--primary) / 0.12)'
                }
              : {}
          }
        >
          {message.role === "assistant" ? (
            <div className="text-sm leading-relaxed prose prose-invert max-w-none chat-ai-markdown">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>

        {message.role === "assistant" && (
          <div className="flex items-center gap-3 px-1 mt-2">
            <div className="relative group/tooltip">
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-lg sm:hover:bg-primary/10 transition-colors ${copied ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 sm:group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                Copy message
              </div>
            </div>
            {!disliked && (
              <div className="relative group/tooltip">
                <button 
                  onClick={handleLike}
                  className={`p-2 rounded-lg sm:hover:bg-primary/10 transition-colors ${liked ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
                >
                  <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 sm:group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                  Good response
                </div>
              </div>
            )}
            {!liked && (
              <div className="relative group/tooltip">
                <button 
                  onClick={handleDislike}
                  className={`p-2 rounded-lg sm:hover:bg-primary/10 transition-colors ${disliked ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
                >
                  <ThumbsDown size={16} fill={disliked ? 'currentColor' : 'none'} />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 sm:group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                  Bad response
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {message.role === "user" && (
        <>
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
          </div>
          
          <div className="absolute top-full right-12 mt-1 flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-auto sm:pointer-events-none sm:group-hover:pointer-events-auto z-50">
            <div className="relative group/tooltip">
              <button 
                onClick={handleCopy}
                className={`p-1.5 rounded-lg sm:hover:bg-primary/10 transition-colors pointer-events-auto ${copied ? 'text-primary' : 'text-muted-foreground sm:hover:text-primary'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-primary text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 sm:group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                Copy message
              </div>
            </div>
            <div className="relative group/tooltip">
              <button 
                onClick={handleEdit}
                className="p-1.5 rounded-lg sm:hover:bg-primary/10 text-muted-foreground sm:hover:text-primary transition-colors pointer-events-auto"
              >
                <Edit size={14} />
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-primary text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 sm:group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                Edit message
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessageItem;
