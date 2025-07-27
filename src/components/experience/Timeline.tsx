import React from 'react';

const Timeline: React.FC = () => {
  return (
    <>
      {/* Timeline line - Responsive positioning */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>
    </>
  );
};

export default Timeline;
