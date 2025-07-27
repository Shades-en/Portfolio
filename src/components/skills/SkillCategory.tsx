import React from 'react';
import { type LucideIcon } from 'lucide-react';
import SkillItem from './SkillItem';

interface Skill {
  readonly name: string;
  readonly experience: string;
  readonly context: string;
  readonly category: string;
  readonly icon: string;
}

interface SkillCategoryProps {
  title: string;
  icon: LucideIcon;
  skills: readonly Skill[];
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ title, icon, skills }) => {
  const Icon = icon;

  return (
    <div className="glass-card p-4 rounded-xl w-96 flex-shrink-0">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 iconic rounded-lg bg-primary mr-3 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-background stroke-2" />
        </div>
        <h3 className="md:text-lg font-semibold text-foreground">
          {title}
        </h3>
      </div>

      <div className="space-y-2">
        {skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillCategory;
