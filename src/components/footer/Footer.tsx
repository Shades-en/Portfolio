// Server Component - Static content rendered on server for SEO benefits
import React from 'react';
import BrandSection from './BrandSection';
import QuickLinks from './QuickLinks';
import ContactInfo from './ContactInfo';
import BottomBar from './BottomBar';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-background via-secondary/10 to-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand & Description */}
          <BrandSection />

          {/* Quick Links */}
          <QuickLinks />

          {/* Contact Info */}
          <ContactInfo />
        </div>

        {/* Bottom Bar */}
        <BottomBar />
      </div>
    </footer>
  );
};

export default Footer;
