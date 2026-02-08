import React from 'react';

const ChatInputSkeleton: React.FC = () => {
  return (
    <div className="w-11/12 mx-auto space-y-4">
      <div className='w-full sm:w-2/3 xl:w-3/5 mx-auto'>
        <div className="px-4 py-3 rounded-[20px] sm:rounded-[25px] h-fit border border-slate-700/40 bg-[var(--chat-foreground)] flex flex-col">
          <div className="w-full px-2 pt-2 pb-2">
            <div className="h-6 w-48 bg-slate-800/40 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="shrink-0 h-9 w-9 rounded-xl bg-slate-800/40 animate-pulse" />
            <div className="shrink-0 h-9 w-9 rounded-xl bg-slate-800/40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputSkeleton;
