'use client';

import React from 'react';
import Image from 'next/image';

interface TechnologyIconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

const TechnologyIcon: React.FC<TechnologyIconProps> = ({ 
  src, 
  alt, 
  size = 16, 
  className = '' 
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      style={{
        width: 'auto',
        height: 'auto',
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
      }}
      onError={(e) => {
        // Fallback to a generic icon if the specific icon fails to load
        e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
      }}
    />
  );
};

export default TechnologyIcon;
