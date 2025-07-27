import React from 'react';
import personalInfo from '@/data/personal-info.json';

const Stats: React.FC = () => {
  const stats = [
    { number: personalInfo.stats.projects, label: "Projects Completed" },
    { number: personalInfo.stats.yearsExperience, label: "Years Experience" },
    { number: personalInfo.stats.technologiesMastered, label: "Technologies Mastered" }
  ];

  return (
    <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center glass-card p-4 lg:p-6 rounded-xl">
          <div className="text-2xl lg:text-4xl font-bold gradient-text mb-2">
            {stat.number}
          </div>
          <div className="text-muted-foreground font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
