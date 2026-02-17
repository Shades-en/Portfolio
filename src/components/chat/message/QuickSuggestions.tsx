'use client';

import React from 'react';
import { Plus } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Tell me about your projects',
  'What\'s your experience with AI/ML?',
  'Show me your tech stack',
  'How can I contact you?',
];

interface QuickSuggestionsProps {
  readonly onSelect: (suggestion: string) => void;
}

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:place-items-start place-items-center sm:grid-cols-2 gap-2 flex w-full justify-center sm:mt-2 mt-10">
      {QUICK_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="flex items-center sm:justify-start justify-center gap-2 w-fit mx-4 my-3 text-foreground text-sm transition-all duration-200 hover:border-primary/50 group"
        >
          <Plus size={16} className="text-primary w-4 h-4 flex-shrink-0" />
          <span className="text-center sm:text-left hover:text-primary transition-colors duration-200">{suggestion}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickSuggestions;
