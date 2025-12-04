import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Edit2, Star, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface ChatOptionsMenuProps {
  readonly onRename: () => void;
  readonly onDelete?: () => void;
  readonly className?: string;
}

const ChatOptionsMenu: React.FC<ChatOptionsMenuProps> = ({ onRename, onDelete, className }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-white text-lg transition-all duration-300 group hover:text-primary outline-none ${className ?? ''}`}
          title="New Chat Options"
        >
          <ChevronDown size={20} className="group-hover:text-primary transition-colors" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-[var(--chat-foreground)] border border-primary/20 rounded-lg shadow-lg z-50 w-40" sideOffset={8}>
        <DropdownMenu.Item className="flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-primary/10 transition-colors text-sm rounded-md cursor-pointer outline-none">
          <Star size={16} className="text-muted-foreground" />
          <span>Star</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          asChild
          onSelect={(e) => {
            e.preventDefault();
            setOpen(false);
            setTimeout(() => onRename(), 120);
          }}
        >
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-primary/10 transition-colors text-sm rounded-md cursor-pointer outline-none">
            <Edit2 size={16} className="text-muted-foreground" />
            <span>Rename</span>
          </button>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="bg-primary/10 h-px my-1" />
        <DropdownMenu.Item asChild onSelect={(e) => e.preventDefault()}>
          <div>
            <ConfirmDialog
              trigger={
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors text-sm rounded-md cursor-pointer outline-none">
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              }
              title="Delete this chat?"
              description="This action cannot be undone."
              confirmLabel="Delete"
              onConfirm={() => onDelete?.()}
            />
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ChatOptionsMenu;
