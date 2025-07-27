import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 hidden" id="blog-empty-state">
      <p className="text-muted-foreground">
        Blog posts coming soon!
      </p>
    </div>
  );
};

export default EmptyState;
