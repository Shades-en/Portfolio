// Server Component - Static content rendered on server for SEO benefits
import React from 'react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import SocialLinks from './SocialLinks';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background/80 to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your ideas to life? Let&apos;s discuss your next project
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form - Client Component for Interactivity */}
          <div className="glass-card p-8 rounded-xl">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <ContactInfo />

            {/* Social Links */}
            <SocialLinks />

            {/* Availability - Commented out for now */}
            {/* <div className="glass-card p-8 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gradient mb-4">
                <div className="w-3 h-3 bg-background rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Available for Work</h4>
              <p className="text-muted-foreground mb-4">
                Currently accepting new projects and collaborations
              </p>
              <Button 
                variant="outline"
                className="border-primary/50 hover:border-primary hover:text-primary hover:bg-primary/10"
              >
                Schedule a Call
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
