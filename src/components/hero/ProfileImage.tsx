import React from 'react';
import Image from 'next/image';
import personalInfo from '@/data/personal-info.json';

interface ProfileImageProps {
  size: 'small' | 'large';
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ size, className = '' }) => {
  // Define size variants
  const sizeClasses = {
    small: 'w-32 h-32 md:w-48 md:h-48', // Mobile/Tablet sizes
    large: 'w-72 h-72' // Desktop size
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-slate-700 overflow-hidden glass-card p-2`}>
        <Image 
          src={personalInfo.personal.profileImage} 
          alt="Owais Iqbal - Full-Stack Developer & AI/ML Engineer" 
          width={320}
          height={320}
          className="w-full h-full object-cover rounded-full scale-125"
          priority
        />
      </div>
      {/* Glowing ring effect */}
      <div className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-spin animate-duration-8000"></div>
      <div className="absolute -inset-8 rounded-full border border-accent/10 animate-spin animate-duration-12000 animate-reverse"></div>
    </div>
  );
};

export default ProfileImage;
