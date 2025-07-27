import React from 'react';
import Education from './Education';
import MyJourney from './MyJourney';
import HowIWork from './HowIWork';
import Stats from './Stats';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Passionate about building transformative solutions that create real impact
          </p>
        </div>

        {/* Education Section */}
        <Education />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* My Journey Section */}
          <MyJourney />

          {/* How I Work Section */}
          <HowIWork />
        </div>

        {/* Stats Section */}
        <Stats />
      </div>
    </section>
  );
};

export default About;
