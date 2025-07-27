// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import personalInfo from '@/data/personal-info.json';

interface LogoProps {
  readonly scrollToSection: (href: string) => void;
}

const Logo: React.FC<LogoProps> = ({ scrollToSection }) => {
  return (
    <div className="flex-shrink-0">
      <button 
        onClick={() => scrollToSection('#hero')}
        className="text-xl font-bold gradient-text font-mono"
      >
        {`<${personalInfo.personal.nickname} />`}
      </button>
    </div>
  );
};

export default Logo;
