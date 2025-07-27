import React from 'react';
import { Code, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExperienceContentProps {
  experience: {
    id: number;
    description: string;
    achievements: string[];
    technologies: string[];
  };
  index: number;
}

const ExperienceContent: React.FC<ExperienceContentProps> = ({ experience, index }) => {
  return (
    <>
      {/* Description - SERVER RENDERED FOR SEO */}
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
        {experience.description}
      </p>
      
      {/* Expanded Content - SERVER RENDERED FOR SEO */}
      <div 
        id={`experience-details-${experience.id}`}
        className="transition-all duration-500 overflow-hidden"
        style={{
          maxHeight: index === 0 ? 'none' : '0',
          opacity: index === 0 ? '1' : '0'
        }}
      >
        {/* Key Achievements - SERVER RENDERED */}
        <div className="mb-4 md:mb-6">
          <h5 className="text-xs md:text-sm font-semibold text-foreground mb-3 flex items-center">
            <Zap size={14} className="mr-2 text-accent flex-shrink-0" />
            Key Achievements
          </h5>
          <ul className="space-y-2">
            {experience.achievements.map((achievement) => (
              <li key={achievement} className="flex items-start text-xs md:text-sm text-muted-foreground leading-relaxed">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="flex-1">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Technologies - SERVER RENDERED */}
        <div>
          <h5 className="text-xs md:text-sm font-semibold text-foreground mb-3 flex items-center">
            <Code size={14} className="mr-2 text-accent flex-shrink-0" />
            Technologies Used
          </h5>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {experience.technologies.map((tech) => (
              <Badge 
                key={tech}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200 text-xs px-2 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperienceContent;
