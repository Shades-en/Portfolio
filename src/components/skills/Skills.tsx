// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Code2, Brain, Server, Monitor, Cloud, type LucideIcon } from 'lucide-react';
import SkillCategory from './SkillCategory';
import SkillsSummary from './SkillsSummary';
import personalInfo from '@/data/personal-info.json';

interface Skill {
  readonly name: string;
  readonly experience: string;
  readonly context: string;
  readonly category: string;
}

interface SkillCategoryData {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly skills: readonly Skill[];
}

const Skills: React.FC = () => {
  const skillCategories: readonly SkillCategoryData[] = [
    {
      title: 'Programming Languages',
      icon: Code2,
      skills: personalInfo.skills.languages
    },
    {
      title: 'AI/ML Technologies',
      icon: Brain,
      skills: personalInfo.skills.ai_ml
    },
    {
      title: 'Backend Development',
      icon: Server,
      skills: personalInfo.skills.backend
    },
    {
      title: 'Frontend Development',
      icon: Monitor,
      skills: personalInfo.skills.frontend
    },
    {
      title: 'Cloud & Databases',
      icon: Cloud,
      skills: personalInfo.skills.cloud_databases
    }
  ];

  return (
    <section id="skills" className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Technical <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Technologies I&apos;ve worked with in real-world projects and professional environments
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCategory
              key={categoryIndex}
              title={category.title}
              icon={category.icon}
              skills={category.skills}
            />
          ))}
        </div>

        {/* Skills Summary */}
        <SkillsSummary />
      </div>
    </section>
  );
};

export default Skills;
