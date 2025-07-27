'use client';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export const ToastProvider: React.FC = () => {
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
};
