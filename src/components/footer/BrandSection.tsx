// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Github, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import ScrollButton from '@/components/ScrollButton';
import personalInfo from '@/data/personal-info.json';

interface SocialLink {
  readonly icon: LucideIcon;
  readonly href: string;
  readonly label: string;
}

const BrandSection: React.FC = () => {
  const socialLinks: SocialLink[] = [
    { icon: Github, href: personalInfo.social.github.url, label: 'GitHub' },
    { icon: Linkedin, href: personalInfo.social.linkedin.url, label: 'LinkedIn' },
    { icon: Mail, href: personalInfo.social.email, label: 'Email' }
  ];

  return (
    <div className="space-y-3 md:space-y-4 text-center md:text-left">
      <ScrollButton 
        targetId="hero"
        className="text-xl md:text-2xl font-bold gradient-text font-mono hover:scale-105 transition-transform duration-200 inline-block"
        ariaLabel="Scroll to top"
      >
        {`<${personalInfo.personal.nickname}/>`}
      </ScrollButton>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
        {personalInfo.personal.closingBio}
      </p>
      <div className="flex justify-center md:justify-start space-x-3 md:space-x-4">
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:scale-110 transition-all duration-200 group"
              aria-label={social.label}
            >
              <Icon size={18} className="text-muted-foreground group-hover:text-primary" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default BrandSection;
