import React from 'react';
import { Code2, Lightbulb, Users, Zap } from 'lucide-react';

interface Principle {
  readonly icon: React.ReactElement;
  readonly title: string;
  readonly description: string;
}

const HowIWork: React.FC = () => {
  const principles: Principle[] = [
    {
      icon: <Code2 size={24} className="text-black stroke-2" />,
      title: "Clean Code",
      description: "Writing maintainable, scalable code that stands the test of time"
    },
    {
      icon: <Lightbulb size={24} className="text-black stroke-2" />,
      title: "Innovation",
      description: "Staying ahead of technology trends and implementing cutting-edge solutions"
    },
    {
      icon: <Users size={24} className="text-black stroke-2" />,
      title: "Collaboration",
      description: "Working effectively with cross-functional teams to deliver exceptional results"
    },
    {
      icon: <Zap size={24} className="text-black stroke-2" />,
      title: "Performance",
      description: "Optimizing applications for speed, accessibility, and user experience"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-foreground">How I Work</h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {principles.map((principle, index) => (
          <div key={principle.title} className="glass-card p-6 rounded-xl group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg iconic mr-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
                {principle.icon}
              </div>
              <h4 className="font-semibold text-foreground">{principle.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowIWork;
