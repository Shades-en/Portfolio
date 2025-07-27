import React from 'react';
import ExperienceHeader from './ExperienceHeader';
import ExperienceContent from './ExperienceContent';

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  location: string;
  logo: string;
  duration: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface ExperienceCardProps {
  experience: ExperienceItem;
  index: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, index }) => {
  return (
    <div className="relative flex items-start group">
      {/* Timeline dot - Responsive positioning */}
      <div className="absolute left-2 md:left-6 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-primary to-accent rounded-full border-2 md:border-4 border-background shadow-lg group-hover:scale-125 transition-transform duration-300 z-10"></div>
      
      {/* Timeline connector - Responsive positioning */}
      <div className="absolute left-4 md:left-8 top-6 md:top-8 w-4 md:w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
      
      {/* Experience Card - SERVER RENDERED */}
      <div className="ml-8 md:ml-20 w-full">
        <div className="glass-card p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
          {/* Card Header */}
          <ExperienceHeader experience={experience} index={index} />
          
          {/* Card Content */}
          <ExperienceContent experience={experience} index={index} />
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
