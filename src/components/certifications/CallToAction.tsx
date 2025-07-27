import React from 'react';
import ScrollButton from '@/components/ScrollButton';

const CallToAction: React.FC = () => {
  return (
    <div className="text-center mt-16">
      <p className="text-muted-foreground mb-6">
        Committed to staying current with the latest technologies and best practices
      </p>
      <ScrollButton 
        targetId="contact" 
        className="glow-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8"
        ariaLabel="Scroll to contact section"
      >
        Discuss Collaboration
      </ScrollButton>
    </div>
  );
};

export default CallToAction;
