import React from 'react';
import ProjectImage from './ProjectImage';
import ProjectContent from './ProjectContent';

interface Project {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly longDescription: string;
  readonly technologies: readonly string[];
  readonly github: string;
  readonly featured: boolean;
  readonly categories: readonly string[];
  readonly image: string;
  readonly status: string;
  readonly priority?: number;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div 
      data-project-categories={project.categories.join(',')}
      className={`glass-card rounded-xl overflow-hidden group animate-fade-in-up ${
        project.featured ? 'md:col-span-2 xl:col-span-1' : ''
      }`}
    >
      {/* Project Image */}
      <ProjectImage project={project} />

      {/* Project Content */}
      <ProjectContent project={project} />
    </div>
  );
};

export default ProjectCard;
