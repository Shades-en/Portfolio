import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

interface DropdownMenuProps {
  readonly trigger: React.ReactNode;
  readonly children: React.ReactNode;
}

interface DropdownMenuItemProps {
  readonly onSelect: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children }) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className="min-w-[160px] bg-[hsl(var(--secondary))] backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg p-1 z-[90]"
          sideOffset={5}
          align="start"
          side="right"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ onSelect, children, className = '' }) => {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={`px-3 py-2 text-sm text-slate-300 rounded-md outline-none cursor-pointer hover:bg-slate-700/50 flex items-center gap-2 ${className}`}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
};
