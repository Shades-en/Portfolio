import React from 'react';
import { Clock, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TechnologyIcon from './TechnologyIcon';

interface Skill {
  readonly name: string;
  readonly experience: string;
  readonly context: string;
  readonly category: string;
  readonly icon: string;
}

interface SkillItemProps {
  skill: Skill;
}

// Fallback icon for skills without specific icons
const getFallbackIcon = (): string => {
  return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
};

const getExperienceBadgeVariant = (experience: string) => {
  // Extract numeric value for more accurate categorization
  const numericMatch = experience.match(/(\d+)\+/);
  const years = numericMatch ? parseInt(numericMatch[1]) : 0;
  
  if (years >= 3 || experience === 'Professional') return 'default';
  if (years >= 2 || experience === 'Current') return 'secondary';
  return 'outline';
};

const getExperienceIcon = (experience: string) => {
  if (experience === 'Professional' || experience === 'Current') return Briefcase;
  return Clock;
};

const SkillItem: React.FC<SkillItemProps> = ({ skill }) => {
  const ExperienceIcon = getExperienceIcon(skill.experience);

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-secondary/30 hover:bg-primary/10 transition-colors duration-200">
      <div className="lg:flex items-center gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-shrink-0">
          <TechnologyIcon
            src={skill.icon || getFallbackIcon()}
            alt={`${skill.name} icon`}
            size={16}
          />
          <span className="font-normal md:font-medium text-foreground text-xs md:text-sm text-nowrap">
            {skill.name}
          </span>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
        <span className="text-xs text-muted-foreground hidden sm:inline truncate">
          {skill.context}
        </span>
      </div>
      <Badge 
        variant={getExperienceBadgeVariant(skill.experience)}
        className="text-xs flex items-center gap-1 px-1.5 py-0.5 ml-2 flex-shrink-0"
      >
        <ExperienceIcon size={8} />
        <span className="text-xs md:text-sm">
          {skill.experience.replace('+ years', 'y+').replace('+ year', 'y+')}
        </span>
      </Badge>
    </div>
  );
};

export default SkillItem;
