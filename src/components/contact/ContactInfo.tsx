// Server Component - No 'use client' directive for SEO benefits
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import personalInfo from '@/data/personal-info.json';

const ContactInfo: React.FC = () => {
  const contactDetails = [
    { 
      icon: <Mail size={20} className="text-white stroke-2" />, 
      label: "Email", 
      value: personalInfo.personal.email, 
      href: personalInfo.social.email 
    },
    { 
      icon: <Phone size={20} className="text-white stroke-2" />, 
      label: "Phone", 
      value: personalInfo.personal.phone, 
      href: personalInfo.social.phone 
    },
    { 
      icon: <MapPin size={20} className="text-white stroke-2" />, 
      label: "Location", 
      value: personalInfo.personal.location, 
      href: "#" 
    }
  ];

  return (
    <div className="glass-card p-8 rounded-xl">
      <h3 className="text-2xl font-semibold mb-6 text-foreground">
        Contact Information
      </h3>
      
      <div className="space-y-6">
        {contactDetails.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center space-x-4 group hover:text-primary transition-colors duration-200"
          >
            <div className="w-12 h-12 iconic rounded-lg bg-primary group-hover:scale-110 transition-transform duration-300 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-medium text-foreground group-hover:text-primary">
                {item.value}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
