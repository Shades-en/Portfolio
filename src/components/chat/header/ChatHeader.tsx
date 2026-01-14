'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Settings, Menu } from 'lucide-react';
import ChatOptionsMenu from './ChatOptionsMenu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentSession } from '@/store/slices/chatSlice';

interface ChatHeaderProps {
  readonly title?: string;
  readonly onMenuClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title = 'New Chat', onMenuClick }) => {
  const dispatch = useAppDispatch();
  const { isTablet, isMobile, messages } = useAppSelector((state) => state.chat);
  const newChat = messages.length === 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editActivatedAtRef = useRef<number>(0);

  const handleDoubleClick = (): void => {
    setIsEditing(true);
  };

  const handleDeleteChat = (): void => {
    dispatch(setCurrentSession(''));
  };

  const renderDropdown = (): React.ReactNode => (
    <ChatOptionsMenu onRename={() => setIsEditing(true)} onDelete={handleDeleteChat} />
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
    <div className="px-6 py-4 absolute top-0 z-[2] w-full bg-[image:var(--chat-header)] sm:bg-none">
      {/* Mobile gradient overlay (opaque -> short fade) */}
      <div className="absolute inset-0 sm:hidden z-0 pointer-events-none" />
      <div className="w-full relative z-10 flex justify-between items-center">
          <div className="flex items-center sm:gap-4 gap-2 relative z-10 flex-shrink-0">
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
            {!newChat && (
              <div className="flex items-center relative z-10 flex-shrink-0">
                {renderTitle()}
                {(!isEditing) && renderDropdown()}
              </div>
            )}
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


