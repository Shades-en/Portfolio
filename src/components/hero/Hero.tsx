import React from 'react';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollButton from '../ScrollButton';
import ProfileImage from './ProfileImage';
import personalInfo from '@/data/personal-info.json';

const Hero: React.FC = () => {

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden grid-pattern">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main boxes */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-primary/20 rotate-45 float-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-16 h-16 border border-accent/20 rotate-12 float-animation animate-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 border border-primary/15 rotate-45 float-animation animate-delay-4000"></div>
        
        {/* Additional animated boxes */}
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border border-primary/10 -rotate-12 float-animation animate-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 border border-accent/10 rotate-30 float-animation animate-delay-3000"></div>
        <div className="absolute bottom-1/3 left-1/5 w-8 h-8 border border-primary/10 rotate-45 float-animation animate-delay-5000"></div>
        <div className="absolute top-2/3 right-1/5 w-14 h-14 border border-accent/15 -rotate-20 float-animation animate-delay-2500"></div>
        
        {/* Small distant boxes */}
        <div className="absolute top-1/5 right-1/2 w-6 h-6 border border-primary/5 rotate-15 float-animation animate-delay-1500"></div>
        <div className="absolute bottom-2/5 left-2/3 w-4 h-4 border border-accent/5 rotate-30 float-animation animate-delay-3500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Profile Image */}
          <div className="flex justify-center lg:hidden">
            <ProfileImage size="small" />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {/* Hi, I&apos;m <br /> */}
              <span className="gradient-text lg:text-7xl">{personalInfo.personal.name}</span>
            </h1>
        
            <p className="text-xl md:text-2xl font-normal lg:font-light text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              {personalInfo.personal.tagline}
            </p>

            <p className="hidden xs-tall:block text-sm md:text-lg lg:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {personalInfo.personal.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <ScrollButton 
                targetId="contact"
                className="glow-button font-semibold px-8 py-6 text-lg inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                ariaLabel="Scroll to contact section"
              >
                Get In Touch
              </ScrollButton>
              
              <Button 
                variant="outline" 
                className="border-primary/50 hover:border-primary hover:bg-primary/10 hover:text-primary px-8 py-6 text-lg group"
                asChild
              >
                <a 
                  href={personalInfo.social.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Owais_Iqbal_Resume.pdf"
                >
                  <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
            <a 
              href={personalInfo.social.github.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              aria-label="GitHub Profile"
            >
              <Github size={24} />
            </a>
            <a 
              href={personalInfo.social.linkedin.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={personalInfo.social.email}
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              aria-label="Email Contact"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>

        {/* Profile Image */}
        <div className="hidden lg:flex justify-center lg:justify-end">
          <ProfileImage size="large" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute lg:bottom-8 bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ScrollButton 
          targetId="about"
          className="text-muted-foreground hover:text-primary transition-colors duration-300"
          ariaLabel="Scroll to about section"
        >
          <ArrowDown size={32} />
        </ScrollButton>
      </div>
    </section>
  );
};

export default Hero;
