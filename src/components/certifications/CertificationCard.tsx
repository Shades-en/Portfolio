// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Award, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CertificatesSection from './CertificatesSection';

interface Certificate {
  readonly url: string;
  readonly title: string;
  readonly year: string;
  readonly credentialId: string;
}

interface Certification {
  readonly id: number;
  readonly title: string;
  readonly provider: string;
  readonly year: string;
  readonly description: string;
  readonly certificates?: readonly Certificate[];
  readonly skills: readonly string[];
}

interface CertificationCardProps {
  cert: Certification;
  index: number;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ cert, index }) => {
  return (
    <div 
      className="glass-card rounded-xl p-6 group animate-fade-in-up grid grid-rows-[auto_1fr_auto] h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 iconic rounded-lg bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Award size={24} className="text-background stroke-2" />
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={16} className="mr-1" />
          {cert.year}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {cert.title}
          </h3>
          <p className="text-accent text-sm font-medium mb-2">
            {cert.provider}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {cert.description}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {cert.skills.slice(0, 3).map((skill, skillIndex) => (
            <Badge key={skillIndex} variant="outline" className="text-xs bg-primary/10">
              {skill}
            </Badge>
          ))}
          {cert.skills.length > 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs bg-primary/10 cursor-pointer">
                +{cert.skills.length - 3} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="w-48 p-3">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-foreground mb-2">Additional Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs bg-primary/5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Certificates */}
      <CertificatesSection certificates={cert.certificates} />
    </div>
  );
};

export default CertificationCard;
