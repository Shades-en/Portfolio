'use client';

// Custom 404 Not Found page for Next.js 15 App Router
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rotate-45 float-animation animate-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-accent/10 rotate-12 float-animation animate-delay-4000"></div>
        <div className="absolute top-2/3 left-1/3 w-16 h-16 border border-primary/5 -rotate-12 float-animation animate-delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-20 h-20 border border-accent/5 rotate-45 float-animation animate-delay-3000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 404 Display */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-8xl md:text-9xl font-bold gradient-text font-mono leading-none">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-primary/10 font-mono leading-none animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Page <span className="gradient-text">Not Found</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Looks like you've ventured into uncharted digital territory. The page you're looking for 
            doesn't exist in this dimension of the web.
          </p>
        </div>

        {/* Glitch Effect */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <Zap size={16} className="animate-pulse" />
              <span className="font-mono text-sm">ERROR: RESOURCE_NOT_FOUND</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button asChild className="group">
            <Link href="/" className="flex items-center gap-2">
              <Home size={18} className="group-hover:scale-110 transition-transform duration-200" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="group flex items-center gap-2"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
            <Search size={18} />
            Explore Instead
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'About', href: '/#about' },
              { name: 'Skills', href: '/#skills' },
              { name: 'Projects', href: '/#projects' },
              { name: 'Contact', href: '/#contact' }
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="p-3 rounded-lg bg-secondary/30 hover:bg-primary/10 transition-colors duration-200 text-center group"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-200">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Lost in the matrix? No worries, even the best developers encounter 404s. 
            <br className="hidden sm:inline" />
            Let's get you back on track! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
