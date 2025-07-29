// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import ScrollButton from '@/components/ScrollButton';
import personalInfo from '@/data/personal-info.json';

const QuickLinks: React.FC = () => {
  const quickLinks = [
    { name: 'About', href: 'about', type: 'scroll' },
    { name: 'Skills', href: 'skills', type: 'scroll' },
    { name: 'Experience', href: 'experience', type: 'scroll' },
    { name: 'Projects', href: 'projects', type: 'scroll' },
    { name: 'Publications', href: 'publications', type: 'scroll' },
    { name: 'Resume', href: personalInfo.social.resume, type: 'external' }
  ];

  return (
    <div className="space-y-3 md:space-y-4 text-center md:text-left md:mx-auto">
      <h3 className="text-base md:text-lg font-semibold text-foreground">Quick Links</h3>
      <ul className="flex flex-wrap justify-center md:flex-col md:justify-start gap-x-6 gap-y-2 md:gap-x-0 md:space-y-2">
        {quickLinks.map((link) => (
          <li key={link.name}>
            {link.type === 'scroll' ? (
              <ScrollButton
                targetId={link.href}
                className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
                ariaLabel={`Scroll to ${link.name} section`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gradient group-hover:w-full transition-all duration-300"></span>
              </ScrollButton>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200 relative group inline-flex items-center gap-1"
                aria-label={`Open ${link.name} in new tab`}
              >
                {link.name}
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gradient group-hover:w-full transition-all duration-300"></span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
