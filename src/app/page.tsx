import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import About from '@/components/about';
import Skills from '@/components/skills';
import Experience from '@/components/experience';
import Projects from '@/components/projects';
import Publications from '@/components/publications';
import Certifications from '@/components/certifications';
import Awards from '@/components/awards';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Owais Iqbal - Full-Stack Developer & AI/ML Engineer',
  description: 'Portfolio of Owais Iqbal - Full-stack developer and AI/ML engineer specializing in React, Next.js, Python, and innovative AI solutions.',
  openGraph: {
    title: 'Owais Iqbal - Full-Stack Developer & AI/ML Engineer',
    description: 'Portfolio showcasing innovative projects in full-stack development and AI/ML engineering.',
    type: 'website',
  },
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Publications />
      <Certifications />
      <Awards />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
