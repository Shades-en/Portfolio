'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type Category = 'all' | 'research' | 'blog';

interface Publication {
  title: string;
  venue: string;
  status?: string;
  date: string;
  description: string;
  category: string;
  doi?: string;
  url?: string;
}

interface PublicationCategoryFilterProps {
  publications: Publication[];
}

const PublicationCategoryFilter: React.FC<PublicationCategoryFilterProps> = ({ publications }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  
  useEffect(() => {
    const grid = document.getElementById('publications-grid');
    const emptyState = document.getElementById('blog-empty-state');
    
    if (!grid || !emptyState) return;
    
    const cards = grid.querySelectorAll('[data-category]');
    let visibleCount = 0;
    
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      const category = cardElement.getAttribute('data-category');
      
      if (activeCategory === 'all' || category === activeCategory) {
        cardElement.style.display = 'block';
        visibleCount++;
      } else {
        cardElement.style.display = 'none';
      }
    });
    
    // Show empty state for blog category when no blog posts exist
    if (activeCategory === 'blog' && visibleCount === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }, [activeCategory]);

  const categories = [
    { id: 'all' as Category, label: 'All Publications' },
    { id: 'research' as Category, label: 'Research' },
    { id: 'blog' as Category, label: 'Blog Posts' }
  ];

  return (
    <div className="mb-8">
      {/* Mobile: Compact Dropdown */}
      <div className="md:hidden">
        <div className="relative max-w-xs mx-auto">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as Category)}
            className="w-full appearance-none bg-background border border-border rounded-full px-4 py-3 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Desktop: Segmented Control */}
      <div className="hidden md:flex justify-center">
        <div className="inline-flex bg-secondary/30 rounded-full p-1 backdrop-blur-sm border border-border/50">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicationCategoryFilter;
