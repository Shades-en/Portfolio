// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import AwardCard from './AwardCard';
import personalInfo from '@/data/personal-info.json';

interface Award {
  readonly id: number;
  readonly title: string;
  readonly organization: string;
  readonly year: string;
  readonly description: string;
  readonly category: string;
  readonly url?: string;
}

const Awards: React.FC = () => {
  const awards: readonly Award[] = (personalInfo as any).achievements || [];

  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section id="awards" className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Awards & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition for excellence in innovation and professional contributions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <AwardCard key={index} award={award} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
