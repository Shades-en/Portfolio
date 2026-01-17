"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Star, MoreHorizontal } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { formatRelativeTime } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { toggleStarSessionRequest, deleteSessionRequest } from '@/store/slices/chatSlice';
import type { Session } from '@/types/chat';

interface ChatListProps {
  readonly chat: Session;
  readonly isActive: boolean;
  readonly showTimestamp?: boolean;
  readonly subtitle?: string;
  readonly variant?: 'default' | 'search';
}

const ChatList: React.FC<ChatListProps> = ({
  chat,
  isActive,
  showTimestamp = true,
  subtitle,
  variant = 'default',
}) => {
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleStarChat = (id: string, starred: boolean): void => {
    dispatch(toggleStarSessionRequest({ sessionId: id, starred }));
  };

  const handleDeleteChat = (id: string): void => {
    dispatch(deleteSessionRequest({ sessionId: id }));
    setShowDeleteDialog(false);
  };
  const baseWrapper = `group relative flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${
    isActive
      ? 'bg-slate-700/60 border border-slate-600 shadow-lg shadow-slate-900'
      : 'lg:hover:bg-slate-800/40 border border-transparent lg:hover:border-slate-700'
  }`;

  return (
    <div className={baseWrapper}>
      <Link
        href={`/chat/${chat.id}`}
        className={`${variant === 'search' ? 'flex-[0_1_92%]' : 'flex-1'} min-w-0 text-left bg-transparent focus:outline-none`}
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
      </Link>

      {variant === 'default' ? (
        <div className="w-10 flex items-center justify-end flex-shrink-0 relative">
          {showTimestamp && (
            <p className="text-xs leading-none h-4 flex items-center text-slate-500 whitespace-nowrap absolute right-0 transition-opacity duration-200 lg:group-hover:opacity-0 lg:group-hover:pointer-events-none">
              {formatRelativeTime(chat.updated_at)}
            </p>
          )}
          <DropdownMenu
            trigger={
              <button
                onClick={(e) => e.stopPropagation()}
                className="ml-1 inline-flex h-4 w-4 p-0 items-center justify-center lg:hover:bg-slate-700/50 rounded transition-all duration-200 opacity-0 lg:group-hover:opacity-100 pointer-events-none lg:group-hover:pointer-events-auto"
                title="Options"
                type="button"
              >
                <MoreHorizontal size={14} className="text-slate-400" />
              </button>
            }
          >
            <DropdownMenuItem onSelect={() => handleStarChat(chat.id, !chat.starred)}>
              <Star size={14} className={chat.starred ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'} />
              {chat.starred ? 'Unstar' : 'Star'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-400 hover:bg-red-900/20">
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenu>
          <ConfirmDialog
            trigger={
              <button className="hidden" type="button" />
            }
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete chat?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => handleDeleteChat(chat.id)}
          />
        </div>
      ) : (
        <>
          <DropdownMenu
            trigger={
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 lg:hover:bg-slate-700/50 rounded-lg transition-all duration-200 lg:hover:scale-110"
                title="Options"
                type="button"
              >
                <MoreHorizontal size={14} className="text-slate-400" />
              </button>
            }
          >
            <DropdownMenuItem onSelect={() => handleStarChat(chat.id, !chat.starred)}>
              <Star size={14} className={chat.starred ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'} />
              {chat.starred ? 'Unstar' : 'Star'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-400 hover:bg-red-900/20">
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenu>
          <ConfirmDialog
            trigger={
              <button className="hidden" type="button" />
            }
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete chat?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => handleDeleteChat(chat.id)}
          />
        </>
      )}
    </div>
  );
};

export default ChatList;
