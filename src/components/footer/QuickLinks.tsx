// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import ScrollButton from '@/components/ScrollButton';

const QuickLinks: React.FC = () => {
  const quickLinks = [
    { name: 'About', href: 'about' },
    { name: 'Skills', href: 'skills' },
    { name: 'Projects', href: 'projects' },
    { name: 'Contact', href: 'contact' }
  ];

  return (
    <div className="space-y-3 md:space-y-4 text-center md:text-left md:mx-auto">
      <h3 className="text-base md:text-lg font-semibold text-foreground">Quick Links</h3>
      <ul className="flex flex-wrap justify-center md:flex-col md:justify-start gap-x-6 gap-y-2 md:gap-x-0 md:space-y-2">
        {quickLinks.map((link, index) => (
          <li key={link.name}>
            <ScrollButton
              targetId={link.href}
              className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
              ariaLabel={`Scroll to ${link.name} section`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gradient group-hover:w-full transition-all duration-300"></span>
            </ScrollButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
