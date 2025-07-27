// Client Component - Needs 'use client' for interactive state
'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
    </div>
  );
};

export default MobileMenuButton;
