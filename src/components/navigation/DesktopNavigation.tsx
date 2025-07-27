// Server Component - No 'use client' directive for SEO benefits
import React from 'react';

interface NavItem {
  readonly name: string;
  readonly href: string;
}

interface DesktopNavigationProps {
  readonly navItems: NavItem[];
  readonly scrollToSection: (href: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ navItems, scrollToSection }) => {
  return (
    <div className="hidden lg:block">
      <div className="ml-10 flex items-baseline space-x-8">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => scrollToSection(item.href)}
            className="text-foreground hover:text-primary transition-colors duration-200 relative group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gradient group-hover:w-full transition-all duration-300"></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesktopNavigation;
