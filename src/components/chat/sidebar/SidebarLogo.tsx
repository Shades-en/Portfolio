import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: '500' });

interface SidebarLogoProps {
  readonly className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className = '' }) => {
  const shadesLogoSize = 24;

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="p-0.5 pr-0 flex-shrink-0">
        <Image 
          src="/white-logo/android-chrome-512x512.png" 
          alt="Shades Icon" 
          width={shadesLogoSize} 
          height={shadesLogoSize} 
          className="rounded-md" 
        />
      </div>
      <div>
        <p className={`${montserrat.className} text-sm font-regular uppercase text-white`}>
          Shades
        </p>
      </div>
    </Link>
  );
};

export default SidebarLogo;
