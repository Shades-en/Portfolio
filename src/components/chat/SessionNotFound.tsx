'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const SessionNotFound: React.FC = () => {
  const router = useRouter();

  const handleStartNewChat = (): void => {
    router.push('/chat');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-slate-300">
            This conversation doesn't exist
          </h2>
          <p className="text-sm text-slate-500">
            The chat you're looking for may have been deleted or never existed.
          </p>
        </div>

        <button
          onClick={handleStartNewChat}
          className="px-5 py-2 bg-secondary text-slate-200 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors border border-slate-700"
        >
          New chat
        </button>
      </div>
    </div>
  );
};

export default SessionNotFound;
