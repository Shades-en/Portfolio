// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import personalInfo from '@/data/personal-info.json';

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-3 md:space-y-4 text-center md:text-left md:mx-auto">
      <h3 className="text-base md:text-lg font-semibold text-foreground">Get In Touch</h3>
      <div className="space-y-2">
        <p className="text-sm md:text-base text-muted-foreground">
          Ready to work together?
        </p>
        <a 
          href="mailto:owaisiqbal2013@gmail.com"
          className="block text-sm md:text-base text-primary hover:text-accent transition-colors duration-200 font-medium"
        >
          {personalInfo.personal.email}
        </a>
        <p className="text-sm md:text-base text-muted-foreground">
          {personalInfo.personal.location}
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
