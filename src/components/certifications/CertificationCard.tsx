// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Award, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <div className="pt-4 mt-2 border-t border-border/50">
        {cert.certificates && cert.certificates.length > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle size={14} className="mr-1 text-primary" />
              <span>
                {cert.certificates.length} certificates
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary">
                    <ExternalLink size={12} className="mr-1" />
                    View All
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end" className="w-64 p-3">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-foreground mb-2">Certificates:</div>
                    {cert.certificates.map((certificate) => (
                      <div key={certificate.credentialId} className="flex items-center justify-between py-1">
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]" title={certificate.title}>
                          {certificate.title}
                        </span>
                        <a
                          href={certificate.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-accent hover:text-accent/80 transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle size={14} className="mr-1 text-primary" />
              Certificate available
            </div>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
              <ExternalLink size={12} className="mr-1" />
              Verify
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationCard;
