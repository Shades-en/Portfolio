// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import Timeline from './Timeline';
import ExperienceCard from './ExperienceCard';
import personalInfo from '@/data/personal-info.json';

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  location: string;
  logo: string;
  duration: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const Experience: React.FC = () => {
  const experiences: ExperienceItem[] = personalInfo.experience;

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rotate-45 float-animation animate-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-accent/10 rotate-12 float-animation animate-delay-4000"></div>
        <div className="absolute top-2/3 left-1/3 w-16 h-16 border border-primary/5 -rotate-12 float-animation animate-delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From enterprise solutions to tech innovation, building scalable systems and 
            leading AI-driven initiatives across diverse technology stacks
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <Timeline />
          
          {/* Experience Cards - ALL CONTENT SERVER-RENDERED FOR SEO */}
          <div className="space-y-8 lg:space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
