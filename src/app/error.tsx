'use client';

// Custom error page for Next.js 15 App Router
import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-destructive/10 rotate-45 float-animation animate-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-destructive/10 rotate-12 float-animation animate-delay-4000"></div>
        <div className="absolute top-2/3 left-1/3 w-16 h-16 border border-destructive/5 -rotate-12 float-animation animate-delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-20 h-20 border border-destructive/5 rotate-45 float-animation animate-delay-3000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center">
              <AlertTriangle size={48} className="text-destructive animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Something Went <span className="text-destructive">Wrong</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Oops! We encountered an unexpected error in the matrix. Our digital gremlins are 
            working hard to fix this glitch in the system.
          </p>
        </div>

        {/* Error Details */}
        <div className="mb-8">
          <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Bug size={18} className="text-destructive" />
              <h3 className="text-lg font-semibold text-foreground">Error Details</h3>
            </div>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <p className="font-mono text-sm text-destructive break-all">
                {error.message || 'An unexpected error occurred'}
              </p>
              {error.digest && (
                <p className="font-mono text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            onClick={reset}
            className="group flex items-center gap-2"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-300" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform duration-200" />
            Go Home
          </Button>
        </div>

        {/* Helpful Information */}
        <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            What can you do?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Refresh the page:</strong> Sometimes a simple reload fixes temporary glitches
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Check your connection:</strong> Ensure you have a stable internet connection
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Try again later:</strong> The issue might be temporary and resolve itself
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Contact support:</strong> If the problem persists, reach out for help
              </p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Don't worry, even the most robust systems encounter errors sometimes. 
            <br className="hidden sm:inline" />
            We're constantly improving to provide you with the best experience! 🛠️
          </p>
        </div>
      </div>
    </div>
  );
}
