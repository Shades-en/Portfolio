'use client';

import React from 'react';
import ChatInputSkeleton from './ChatInputSkeleton';

const ChatMessagesSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 overflow-y-auto bg-[image:var(--chat-background-alt)] pt-16 pb-32">
        <div className="w-11/12 sm:w-7/12 xl:w-1/2 mx-auto py-6 space-y-6">
          {/* User message skeleton - right aligned */}
          <div className="flex justify-end">
            <div className="max-w-[80%] space-y-2">
              <div className="h-4 w-48 bg-slate-800/60 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-slate-800/60 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Assistant message skeleton - left aligned */}
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2">
              <div className="h-4 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-56 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-72 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-40 bg-slate-800/40 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* User message skeleton */}
          <div className="flex justify-end">
            <div className="max-w-[80%] space-y-2">
              <div className="h-4 w-36 bg-slate-800/60 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Assistant message skeleton */}
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2">
              <div className="h-4 w-52 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-48 bg-slate-800/40 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* User message skeleton */}
          <div className="flex justify-end">
            <div className="max-w-[80%] space-y-2">
              <div className="h-4 w-44 bg-slate-800/60 rounded-lg animate-pulse" />
              <div className="h-4 w-28 bg-slate-800/60 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Assistant message skeleton - larger response */}
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2">
              <div className="h-4 w-60 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-72 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-56 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-44 bg-slate-800/40 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-2 z-50">
        <div className="h-8 bg-gradient-to-b from-transparent to-[hsl(222,34%,10%)] pointer-events-none" />
        <div className="bg-[hsl(222,34%,10%)] pb-4">
          <ChatInputSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ChatMessagesSkeleton;
