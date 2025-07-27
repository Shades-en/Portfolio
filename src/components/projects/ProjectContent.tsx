import React from 'react';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectContentProps {
  project: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    technologies: readonly string[];
    github: string;
    featured: boolean;
    status: string;
  };
}

const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className="text-xs">
          {project.status}
        </Badge>
        {project.featured && (
          <Badge variant="default" className="text-xs">
            Featured
          </Badge>
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        {project.title}
      </h3>
      
      <p className="text-sm text-primary font-medium mb-3">
        {project.subtitle}
      </p>

      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 4).map((tech, techIndex) => (
          <Badge key={techIndex} variant="outline" className="text-xs bg-primary/10">
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 4 && (
          <Badge variant="outline" className="text-xs bg-primary/10">
            +{project.technologies.length - 4} more
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button size="sm" variant="outline" asChild className="flex-1 group/view-code">
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-2 stroke-white group-hover/view-code:stroke-black" />
            View Code
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProjectContent;
