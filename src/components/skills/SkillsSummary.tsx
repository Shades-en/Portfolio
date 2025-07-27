import React from 'react';
import { Code2, Brain, Server, Cloud, type LucideIcon } from 'lucide-react';

interface SummaryStatProps {
  number: string;
  label: string;
  icon: LucideIcon;
}

const SummaryStat: React.FC<SummaryStatProps> = ({ number, label, icon }) => {
  const IconComponent = icon;
  
  return (
    <div className="text-center glass-card p-3 rounded-lg">
      <div className="w-8 h-8 iconic rounded-lg bg-primary mx-auto mb-2 flex items-center justify-center">
        <IconComponent size={16} className="text-background" />
      </div>
      <div className="text-2xl font-bold gradient-text mb-1">
        {number}
      </div>
      <div className="text-muted-foreground font-medium text-xs">
        {label}
      </div>
    </div>
  );
};

const SkillsSummary: React.FC = () => {
  const summaryStats = [
    { number: "6+", label: "Languages", icon: Code2 },
    { number: "6+", label: "AI/ML Tools", icon: Brain },
    { number: "9+", label: "Dev Frameworks", icon: Server },
    { number: "3+", label: "Cloud Tech", icon: Cloud }
  ];

  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
      {summaryStats.map((stat, index) => (
        <SummaryStat
          key={stat.label}
          number={stat.number}
          label={stat.label}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default SkillsSummary;
