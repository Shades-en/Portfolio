// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import CertificationCard from './CertificationCard';
import CallToAction from './CallToAction';
import personalInfo from '@/data/personal-info.json';

interface Certificate {
  readonly url: string;
  readonly title: string;
  readonly year: string;
  readonly credentialId: string;
}

interface Certification {
  readonly id: number;
  readonly title: string;
  readonly provider: string;
  readonly year: string;
  readonly description: string;
  readonly certificates?: readonly Certificate[];
  readonly skills: readonly string[];
}

const Certifications: React.FC = () => {
  const certifications: readonly Certification[] = personalInfo.certifications;

  return (
    <section id="certifications" className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continuous learning and professional development in cutting-edge technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <CallToAction />
      </div>
    </section>
  );
};

export default Certifications;
