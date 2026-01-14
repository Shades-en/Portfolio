import React from 'react';
import { PenTool } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTemporarySession } from '@/store/slices/chatSlice';

interface NewChatButtonProps {
  readonly className?: string;
  readonly onCollapsedChange?: (collapsed: boolean) => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ className = '', onCollapsedChange }) => {
  const dispatch = useAppDispatch();
  const { isTablet, isMobile } = useAppSelector((state) => state.chat);
  const logoSize = 16;

  const handleNewChat = (): void => {
    dispatch(createTemporarySession());
    if ((isMobile || isTablet) && onCollapsedChange) {
      onCollapsedChange(true);
    }
  };

  return (
    <button 
      onClick={handleNewChat} 
      className="flex items-center gap-3 px-0 py-1.5 text-white hover:text-primary transition-colors duration-200 group"
    >
      <div className='pl-2'>
        <PenTool size={logoSize} className="text-slate-400 group-hover:text-primary transition-colors" />
      </div>
      <span className={`text-xs font-medium whitespace-nowrap ${className}`}>New Chat</span>
    </button>
  );
};

export default NewChatButton;
