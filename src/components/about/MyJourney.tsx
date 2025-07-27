import React from 'react';
import personalInfo from '@/data/personal-info.json';

const MyJourney: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-foreground">My Journey</h3>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {personalInfo.personal.story.map((story, index) => (
          <p key={story} className='text-sm md:text-base'>{story}</p>
        ))}
      </div>
    </div>
  );
};

export default MyJourney;
