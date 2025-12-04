'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Settings, Menu } from 'lucide-react';
import ChatOptionsMenu from '@/components/chat/ChatOptionsMenu';

interface ChatHeaderProps {
  readonly title?: string;
  readonly onDeleteChat?: () => void;
  readonly isTablet?: boolean;
  readonly isMobile?: boolean;
  readonly onMenuClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title = 'New Chat', onDeleteChat, isTablet, isMobile, onMenuClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editActivatedAtRef = useRef<number>(0);

  const handleDoubleClick = (): void => {
    setIsEditing(true);
  };

  const renderDropdown = (): React.ReactNode => (
    <ChatOptionsMenu onRename={() => setIsEditing(true)} onDelete={onDeleteChat} />
  );

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

  const renderTitle = (): React.ReactNode => {
    return isEditing ? (
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
    );
  };

  return (
    <div className="px-6 py-4 absolute top-0 z-[2] w-full">
      <div className="w-full relative flex justify-between items-center">
        {(isTablet || isMobile) && (
          <button
            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
            title="Menu"
            aria-label="Open menu"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
          {renderTitle()}
          {renderDropdown()}
        </div>

        <button
            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
            title="Settings"
          >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;


