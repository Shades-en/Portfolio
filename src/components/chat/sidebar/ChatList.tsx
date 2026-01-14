"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Session } from '@/types/chat';

interface ChatListProps {
  readonly chat: Session;
  readonly isActive: boolean;
  readonly onClick: (session: Session) => void;
  readonly onDelete?: (id: string, e?: React.MouseEvent) => void;
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
  const formatRelativeTime = (value: Date): string => {
    const now = Date.now();
    const t = new Date(value).getTime();
    const diffSec = Math.max(0, Math.floor((now - t) / 1000));
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    const diffMon = Math.floor(diffDay / 30);
    if (diffMon < 12) return `${diffMon}mo ago`;
    const diffYear = Math.floor(diffMon / 12);
    return `${diffYear}y ago`;
  };
  const baseWrapper = `group w-[95%] relative flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${
    isActive
      ? 'bg-slate-700/60 border border-slate-600 shadow-lg shadow-slate-900'
      : 'lg:hover:bg-slate-800/40 border border-transparent lg:hover:border-slate-700'
  }`;

  return (
    <div className={baseWrapper}>
      <button
        onClick={() => onClick(chat)}
        className={`${variant === 'search' ? 'flex-[0_1_92%]' : 'flex-1'} min-w-0 text-left bg-transparent focus:outline-none`}
        type="button"
      >
        <div className="relative min-w-0">
          <p
            className="text-xs text-white truncate whitespace-nowrap font-medium leading-tight"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, #000 0%, #000 calc(100% - 2.5rem), rgba(0,0,0,0.45) calc(100% - 2rem), rgba(0,0,0,0.15) calc(100% - 1rem), transparent 100%)',
              maskImage:
                'linear-gradient(to right, #000 0%, #000 calc(100% - 2.5rem), rgba(0,0,0,0.45) calc(100% - 2rem), rgba(0,0,0,0.15) calc(100% - 1rem), transparent 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          >
            {chat.name}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </button>

      {variant === 'default' ? (
        <div className="w-10 flex items-center justify-end flex-shrink-0">
          {showTimestamp && (
            <p className="text-xs leading-none h-4 flex items-center text-slate-500 whitespace-nowrap lg:group-hover:hidden group-focus-within:hidden">
              {formatRelativeTime(new Date(chat.updated_at))}
            </p>
          )}
          {onDelete && (
            <ConfirmDialog
              trigger={
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="ml-1 inline-flex h-4 w-4 p-0 items-center justify-center lg:hover:bg-red-900/30 rounded transition-colors duration-200 hidden lg:group-hover:inline-flex group-focus-within:inline-flex"
                  title="Delete"
                  type="button"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              }
              title="Delete chat?"
              description="This action cannot be undone."
              confirmLabel="Delete"
              onConfirm={() => onDelete(chat.id)}
            />
          )}
        </div>
      ) : (
        onDelete && (
          <ConfirmDialog
            trigger={
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 lg:hover:bg-red-900/30 rounded-lg transition-all duration-200 lg:hover:scale-110"
                title="Delete"
                type="button"
              >
                <Trash2 size={12} className="text-red-500" />
              </button>
            }
            title="Delete chat?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => onDelete(chat.id)}
          />
        )
      )}
    </div>
  );
};

export default ChatList;
