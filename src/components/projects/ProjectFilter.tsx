'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ProjectFilterProps {
  categories: string[];
  onCategoryChange?: (category: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ categories, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Use CSS to control the visibility of project cards
  React.useEffect(() => {
    const projectCards = document.querySelectorAll('[data-project-categories]');
    projectCards.forEach((card) => {
      const cardElement = card as HTMLElement;
      const cardCategories = cardElement.getAttribute('data-project-categories');
      const categoriesArray = cardCategories ? cardCategories.split(',') : [];
      
      if (selectedCategory === 'All' || categoriesArray.includes(selectedCategory)) {
        cardElement.style.display = 'block';
      } else {
        cardElement.style.display = 'none';
      }
    });
  }, [selectedCategory]);

  return (
    <div className="mb-12">
      {/* Mobile: Compact Dropdown */}
      <div className="md:hidden">
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full appearance-none bg-background border border-border rounded-full px-4 py-3 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'All' ? 'All Projects' : category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Desktop: Button Layout */}
      <div className="hidden md:flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className="transition-all duration-200 hover:scale-105"
          >
            {category === 'All' ? 'All Projects' : category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectFilter;
