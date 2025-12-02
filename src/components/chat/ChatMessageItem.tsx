import React from "react";
import { User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
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
  return (
    <div
      className={`flex gap-4 animate-fade-in-up ${
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
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <Copy size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Copy message
              </div>
            </div>
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Good response
              </div>
            </div>
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                <ThumbsDown size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary/90 text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Bad response
              </div>
            </div>
          </div>
        )}
      </div>

      {message.role === "user" && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageItem;
