// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Github, Linkedin, BookOpenText } from 'lucide-react';
import personalInfo from '@/data/personal-info.json';

const SocialLinks: React.FC = () => {
  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: personalInfo.social.github.url,
      username: personalInfo.social.github.username
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: personalInfo.social.linkedin.url,
      username: personalInfo.social.linkedin.username
    },
    {
      icon: BookOpenText,
      label: 'Medium',
      href: personalInfo.social.medium.url,
      username: personalInfo.social.medium.username
    }
  ];

  return (
    <div className="glass-card p-8 rounded-xl">
      <h3 className="text-2xl font-semibold mb-6 text-foreground">
        Follow Me
      </h3>
      
      <div className="space-y-4">
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg iconic bg-accent-gradient group-hover:scale-110 transition-transform duration-300">
                  <Icon size={18} className="text-background" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{social.label}</p>
                  <p className="text-sm text-muted-foreground">{social.username}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-primary">→</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
