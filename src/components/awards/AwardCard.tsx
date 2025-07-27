// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Trophy, Star, Award, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Award {
  readonly id: number;
  readonly title: string;
  readonly organization: string;
  readonly year: string;
  readonly description: string;
  readonly category: string;
  readonly url?: string;
}

interface AwardCardProps {
  award: Award;
  index: number;
}

const getCategoryIcon = (category: string) => {
  if (category === 'corporate') return Star;
  if (category === 'competitive') return Trophy;
  return Award;
};

const AwardCard: React.FC<AwardCardProps> = ({ award, index }) => {
  const IconComponent = getCategoryIcon(award.category);
  
  return (
    <div 
      key={`award-${index}`} 
      className="glass-card rounded-xl p-5 group hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg iconic flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <IconComponent size={20} className="text-black stroke-2" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm leading-tight mb-1 group-hover:text-primary transition-colors duration-300">
            {award.title}
          </h3>
          <p className="text-xs text-primary font-medium mb-2">
            {award.organization}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {award.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                {award.category}
              </span>
              {award.url && (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary">
                    <ExternalLink size={12} className="mr-1" />
                    View
                  </Button>
                </a>
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={12} className="mr-1" />
              {award.year}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardCard;
