'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExperienceToggleProps {
  experienceId: number;
  defaultExpanded?: boolean;
}

const ExperienceToggle: React.FC<ExperienceToggleProps> = ({ 
  experienceId, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Use CSS to control the expanded content visibility
  useEffect(() => {
    const expandedContent = document.getElementById(`experience-details-${experienceId}`);
    if (expandedContent) {
      if (isExpanded) {
        expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
        expandedContent.style.opacity = '1';
      } else {
        expandedContent.style.maxHeight = '0';
        expandedContent.style.opacity = '0';
      }
    }
  }, [isExpanded, experienceId]);

  return (
    <button
      onClick={toggleExpanded}
      className="p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
      aria-expanded={isExpanded}
      aria-controls={`experience-details-${experienceId}`}
    >
      <ChevronDown 
        size={20} 
        className={`text-muted-foreground transition-transform duration-300 ${
          isExpanded ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
};

export default ExperienceToggle;
