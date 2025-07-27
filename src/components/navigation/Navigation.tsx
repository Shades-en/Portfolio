'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import DesktopNavigation from './DesktopNavigation';
import MobileMenuButton from './MobileMenuButton';
import MobileNavigation from './MobileNavigation';

interface NavItem {
  readonly name: string;
  readonly href: string;
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    if (window.scrollY > 50) {
      setScrolled(true);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Publications', href: '#publications' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Awards', href: '#awards' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-card backdrop-blur-md border-x-0' : 'bg-transparent'
    }`}>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo scrollToSection={scrollToSection} />

          {/* Desktop Navigation */}
          <DesktopNavigation navItems={navItems} scrollToSection={scrollToSection} />

          {/* Mobile menu button */}
          <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation 
          navItems={navItems} 
          isOpen={isOpen} 
          scrollToSection={scrollToSection} 
        />
      </div>
    </nav>
  );
};

export default Navigation;
