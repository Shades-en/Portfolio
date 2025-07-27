import React from 'react';
import { BookOpen, ExternalLink, Calendar, Award, PenTool } from 'lucide-react';

interface Publication {
  title: string;
  description: string;
  venue: string;
  date: string;
  category: string;
  status?: string;
  doi?: string;
  url?: string;
}

interface PublicationCardProps {
  publication: Publication;
}

const getCategoryIcon = (category: string) => {
  return category === 'blog' ? <PenTool size={20} className="text-accent" /> : <BookOpen size={20} className="text-accent" />;
};

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  return (
    <div className="glass-card p-6 rounded-xl group hover:scale-[1.02] transition-all duration-300" data-category={publication.category}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
          {getCategoryIcon(publication.category)}
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-md font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
              {publication.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {publication.description}
            </p>
          </div>
          
          {/* Publication Details */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <Award size={12} className="text-accent" />
              <span className="font-medium text-foreground">{publication.venue}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar size={12} className="text-accent" />
              <span className="text-muted-foreground">{publication.date}</span>
            </div>
            
            {publication.status && (
              <div className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                {publication.status.split(',')[0]}
              </div>
            )}
            
            {publication.doi && (
              <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                Published
              </div>
            )}
          </div>
          
          {/* Links */}
          {(publication.url || publication.doi) && (
            <div className="pt-2">
              {publication.url && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors duration-300 text-sm font-medium"
                >
                  <ExternalLink size={14} />
                  <span>View</span>
                </a>
              )}
              {publication.doi && !publication.url && (
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors duration-300 text-sm font-medium"
                >
                  <ExternalLink size={14} />
                  <span>DOI</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;
