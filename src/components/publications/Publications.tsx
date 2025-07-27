import React from 'react';
import PublicationCategoryFilter from './PublicationCategoryFilter';
import PublicationCard from './PublicationCard';
import EmptyState from './EmptyState';
import personalInfo from '@/data/personal-info.json';

const Publications: React.FC = () => {
  return (
    <section id="publications" className="py-16 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Publications & <span className="gradient-text">Writing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Research contributions and technical insights
          </p>
        </div>

        {/* Client-side Category Filter */}
        <PublicationCategoryFilter publications={personalInfo.publications} />

        {/* Server-rendered Publications Content for SEO */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto" id="publications-grid">
          {personalInfo.publications.map((publication) => (
            <PublicationCard key={publication.title} publication={publication} />
          ))}
        </div>
        
        {/* Empty state for blog category */}
        <EmptyState />
      </div>
    </section>
  );
};

export default Publications;
