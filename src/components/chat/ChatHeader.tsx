'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Settings, Trash2, Edit2, Star, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface ChatHeaderProps {
  readonly title?: string;
  readonly onDeleteChat?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title = 'New Chat', onDeleteChat }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editActivatedAtRef = useRef<number>(0);

  const handleDoubleClick = (): void => {
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing || !inputRef.current) return;
    editActivatedAtRef.current = Date.now();
    const el = inputRef.current;
    const selectAll = (): void => {
      el.focus();
      try {
        el.setSelectionRange(0, el.value.length);
      } catch {
        el.select();
      }
    };
    // Run on next animation frame and again on a microtask to survive menu close timing
    requestAnimationFrame(() => {
      selectAll();
      setTimeout(selectAll, 0);
    });
  }, [isEditing]);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const since = Date.now() - editActivatedAtRef.current;
    // Ignore and recover from blurs that happen immediately after entering edit mode
    if (since < 400) {
      e.preventDefault();
      e.stopPropagation();
      // Re-focus to keep editing state
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className="px-6 py-4 absolute top-0 z-[2] w-full">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                const el = e.currentTarget;
                requestAnimationFrame(() => {
                  try {
                    el.setSelectionRange(0, el.value.length);
                  } catch {
                    el.select();
                  }
                });
              }}
              ref={inputRef}
              autoFocus
              className="bg-transparent text-white text-lg outline-none focus:border-primary px-1 min-w-3"
            />
          ) : (
            <span onDoubleClick={handleDoubleClick} className="cursor-text text-white text-lg">
              {editedTitle}
            </span>
          )}
          <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-white text-lg transition-all duration-300 group hover:text-primary outline-none"
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
                  // Prevent default select behavior to avoid immediate refocus on trigger
                  e.preventDefault();
                  // Close menu then enter edit mode shortly after to allow DOM to settle
                  setMenuOpen(false);
                  setTimeout(() => setIsEditing(true), 120);
                }}
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-primary/10 transition-colors text-sm rounded-md cursor-pointer outline-none"
                >
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
                    onConfirm={() => onDeleteChat?.()}
                  />
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;


