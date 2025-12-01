import React from 'react';
import { Trash2 } from 'lucide-react';

interface ChatItem {
  readonly id: string;
  readonly title: string;
  readonly timestamp: Date;
  readonly isActive?: boolean;
}

interface ChatListProps {
  readonly chat: ChatItem;
  readonly isActive: boolean;
  readonly onClick: (chat: ChatItem) => void;
  readonly onDelete?: (id: string, e: React.MouseEvent) => void;
  readonly showTimestamp?: boolean;
  readonly subtitle?: string;
  readonly variant?: 'default' | 'search';
}

const ChatList: React.FC<ChatListProps> = ({
  chat,
  isActive,
  onClick,
  onDelete,
  showTimestamp = true,
  subtitle,
  variant = 'default',
}) => {
  const formatStableTime = (value: Date): string => {
    const iso = new Date(value).toISOString();
    return iso.slice(11, 16); // HH:MM in UTC
  };
  const baseWrapper = `group relative flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${
    isActive
      ? 'bg-slate-700/60 border border-slate-600 shadow-lg shadow-slate-900'
      : 'hover:bg-slate-800/40 border border-transparent hover:border-slate-700'
  }`;

  return (
    <div className={baseWrapper}>
      <button
        onClick={() => onClick(chat)}
        className="flex-1 min-w-0 text-left bg-transparent focus:outline-none"
        type="button"
      >
        <div className="relative min-w-0">
          <p
            className="text-sm text-white truncate whitespace-nowrap font-medium leading-tight"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, #000 0%, #000 calc(100% - 2.5rem), rgba(0,0,0,0.45) calc(100% - 2rem), rgba(0,0,0,0.15) calc(100% - 1rem), transparent 100%)',
              maskImage:
                'linear-gradient(to right, #000 0%, #000 calc(100% - 2.5rem), rgba(0,0,0,0.45) calc(100% - 2rem), rgba(0,0,0,0.15) calc(100% - 1rem), transparent 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          >
            {chat.title}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </button>

      {variant === 'default' ? (
        <div className="w-10 flex items-center justify-end flex-shrink-0">
          {showTimestamp && (
            <p className="text-xs leading-none h-4 flex items-center text-slate-500 whitespace-nowrap group-hover:hidden group-focus-within:hidden">
              {formatStableTime(chat.timestamp)}
            </p>
          )}
          {onDelete && (
            <button
              onClick={(e) => onDelete(chat.id, e)}
              className="ml-1 inline-flex h-4 w-4 p-0 items-center justify-center hover:bg-red-900/30 rounded transition-colors duration-200 hidden group-hover:inline-flex group-focus-within:inline-flex"
              title="Delete"
              type="button"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          )}
        </div>
      ) : (
        onDelete && (
          <button
            onClick={(e) => onDelete(chat.id, e)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
            title="Delete"
            type="button"
          >
            <Trash2 size={12} className="text-red-500" />
          </button>
        )
      )}
    </div>
  );
};

export default ChatList;
