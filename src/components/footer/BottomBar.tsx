// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Heart } from 'lucide-react';
import personalInfo from '@/data/personal-info.json';

const BottomBar: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left text-muted-foreground text-xs md:text-sm">
        <div className="flex items-center">
          <span>© {currentYear} {personalInfo.personal.name}. Made with</span>
          <Heart size={14} className="mx-1 md:mx-2 text-red-500 animate-pulse" />
          <span>and lots of coffee.</span>
        </div>
      </div>
      
      <div className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
        <span>Built with React, Next.js & Tailwind CSS</span>
      </div>
    </div>
  );
};

export default BottomBar;
