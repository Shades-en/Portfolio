import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import ExperienceToggle from './ExperienceToggle';

interface ExperienceHeaderProps {
  experience: {
    id: number;
    title: string;
    company: string;
    location: string;
    logo: string;
    duration: string;
  };
  index: number;
}

const ExperienceHeader: React.FC<ExperienceHeaderProps> = ({ experience, index }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:mb-4 md:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Mobile: Company Logo + Meta Info Side by Side */}
        <div className="flex items-start justify-between md:block w-full sm:w-auto">
          {/* Company Logo - SERVER RENDERED */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0 p-2">
            <Image
              src={experience.logo}
              alt={`${experience.company} logo`}
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority={index === 0}
            />
          </div>
          
          {/* Meta Info - Mobile: Right side, Desktop: Below title */}
          <div className="flex flex-col gap-1 md:hidden text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar size={10} className="mr-1 flex-shrink-0" />
              <span className="truncate">{experience.duration}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={10} className="mr-1 flex-shrink-0" />
              <span className="truncate">{experience.location}</span>
            </div>
          </div>
        </div>
        
        {/* Title and Company - SERVER RENDERED */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 leading-tight">
            {experience.title}
          </h3>
          <h4 className="text-base md:text-lg font-semibold text-primary mb-2 leading-tight">
            {experience.company}
          </h4>
          
          {/* Meta Info - Desktop: Below company name */}
          <div className="hidden md:flex md:flex-wrap md:items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar size={12} className="mr-2 flex-shrink-0" />
              <span className="truncate">{experience.duration}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={12} className="mr-2 flex-shrink-0" />
              <span className="truncate">{experience.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expand/Collapse Button - ONLY INTERACTIVITY */}
      <ExperienceToggle 
        experienceId={experience.id}
        defaultExpanded={index === 0}
      />
    </div>
  );
};

export default ExperienceHeader;
