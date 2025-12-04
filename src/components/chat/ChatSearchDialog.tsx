import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import ChatListItem from './ChatList';

export interface ChatSearchItem {
  readonly id: string;
  readonly title: string;
  readonly timestamp: Date;
  readonly isActive?: boolean;
}

interface ChatSearchDialogProps {
  readonly trigger: React.ReactNode;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly searchQuery: string;
  readonly onSearchQueryChange: (value: string) => void;
  readonly items: readonly ChatSearchItem[];
  readonly onDelete?: (id: string) => void;
  readonly onSelect?: (chat: ChatSearchItem) => void;
  readonly subtitleFor?: (date: Date) => string;
}

const ChatSearchDialog: React.FC<ChatSearchDialogProps> = ({
  trigger,
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  items,
  onDelete,
  onSelect,
  subtitleFor,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--chat-foreground)] border border-primary/20 rounded-lg shadow-lg z-50 w-2/5 h-2/5 max-h-[60%] flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <Dialog.Title className="text-lg font-semibold text-white mb-3">Search Chats</Dialog.Title>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search your chats..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
            {items.length > 0 ? (
              items.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={!!chat.isActive}
                  onClick={() => onOpenChange(false)}
                  onDelete={onDelete ? (id) => onDelete(id) : undefined}
                  subtitle={subtitleFor ? subtitleFor(chat.timestamp) : undefined}
                  variant="search"
                />
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-center">
                <p className="text-sm text-slate-500">No chats found</p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChatSearchDialog;
