'use client';

import React from 'react';

interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ 
  targetId, 
  children, 
  className = '',
  ariaLabel 
}) => {
  const scrollToTarget = () => {
    const element = document.querySelector(`#${targetId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={scrollToTarget}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default ScrollButton;
