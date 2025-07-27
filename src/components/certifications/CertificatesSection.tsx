'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Certificate {
  readonly url: string;
  readonly title: string;
  readonly year: string;
  readonly credentialId: string;
}

interface CertificatesSectionProps {
  certificates?: readonly Certificate[];
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [showCertificatesTooltip, setShowCertificatesTooltip] = useState(false);

  return (
    <div className="pt-4 mt-2 border-t border-border/50">
      {certificates && certificates.length > 0 ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <CheckCircle size={14} className="mr-1 text-primary" />
            <span>
              {certificates.length} certificates
            </span>
          </div>
          <div className="relative">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="View all certificates"
              onClick={() => setShowCertificatesTooltip(!showCertificatesTooltip)}
              onBlur={(e) => {
                // Only close if focus is moving outside the tooltip area
                if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                  setShowCertificatesTooltip(false);
                }
              }}
            >
              <ExternalLink size={12} className="mr-1" />
              View All
            </Button>
            {showCertificatesTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-popover border border-border rounded-md shadow-lg z-50">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-foreground mb-2">Certificates:</div>
                  {certificates.map((certificate) => (
                    <div key={certificate.credentialId} className="flex items-center justify-between py-1">
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]" title={certificate.title}>
                        {certificate.title}
                      </span>
                      <a
                        href={certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-accent hover:text-accent/80 transition-colors"
                      >
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  ))}
                </div>
                {/* Close button for mobile */}
                <button
                  className="absolute top-1 right-1 w-4 h-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCertificatesTooltip(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <CheckCircle size={14} className="mr-1 text-primary" />
            Certificate available
          </div>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
            <ExternalLink size={12} className="mr-1" />
            Verify
          </Button>
        </div>
      )}
    </div>
  );
};

export default CertificatesSection;
