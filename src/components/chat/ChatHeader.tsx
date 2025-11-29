'use client';

import React, { useState } from 'react';
import { Settings, MoreVertical, Trash2, Edit2, Star, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ChatHeaderProps {
  readonly title?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title = 'New Chat' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleDoubleClick = (): void => {
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setIsEditing(false);
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
    <div className="px-6 py-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-transparent text-white text-lg outline-none border-b border-primary/50 focus:border-primary px-1"
            />
          ) : (
            <span onDoubleClick={handleDoubleClick} className="cursor-text text-white text-lg">
              {editedTitle}
            </span>
          )}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-white text-lg transition-all duration-300 group hover:text-primary outline-none"
                title="New Chat Options"
              >
                <ChevronDown size={20} className="group-hover:text-primary transition-colors" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-secondary/95 border border-primary/20 rounded-lg shadow-lg z-50 w-40" sideOffset={8}>
              <DropdownMenu.Item className="flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-primary/10 transition-colors text-sm rounded-md cursor-pointer outline-none">
                <Star size={16} className="text-muted-foreground" />
                <span>Star</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button
                  onClick={handleDoubleClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-primary/10 transition-colors text-sm rounded-md cursor-pointer outline-none"
                >
                  <Edit2 size={16} className="text-muted-foreground" />
                  <span>Rename</span>
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="bg-primary/10 h-px my-1" />
              <DropdownMenu.Item className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors text-sm rounded-md cursor-pointer outline-none">
                <Trash2 size={16} />
                <span>Delete</span>
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
          <button
            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;


