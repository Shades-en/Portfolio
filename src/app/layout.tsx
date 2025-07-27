import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { TooltipProvider } from '@/components/ui/tooltip';

import personalInfo from "@/data/personal-info.json";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: personalInfo.seo.title,
  description: personalInfo.seo.description,
  keywords: personalInfo.seo.keywords,
  authors: [{ name: personalInfo.personal.name, url: personalInfo.social.linkedin.url }],
  creator: personalInfo.personal.name,
  publisher: personalInfo.personal.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://owaisiqbal.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://owaisiqbal.dev',
    title: 'Owais Iqbal - Portfolio',
    description: 'Full-stack developer and AI/ML engineer portfolio showcasing innovative projects and technical expertise.',
    siteName: 'Owais Iqbal Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owais Iqbal - Portfolio',
    description: 'Full-stack developer and AI/ML engineer portfolio showcasing innovative projects and technical expertise.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${jetbrainsMono.variable} antialiased`}>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": personalInfo.personal.name,
              "jobTitle": personalInfo.personal.title,
              "worksFor": {
                "@type": "Organization",
                "name": personalInfo.personal.company
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": personalInfo.personal.location
              },
              "email": personalInfo.personal.email,
              "telephone": personalInfo.personal.phone,
              "url": "https://owaisiqbal.dev",
              "sameAs": [
                personalInfo.social.linkedin,
                personalInfo.social.github
              ],
              "knowsAbout": [
                "Artificial Intelligence",
                "Machine Learning",
                "Full Stack Development",
                "Python",
                "React.js",
                "Cloud Computing",
                "Accessibility Technology"
              ],
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": personalInfo.education.institution
              }
            })
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>
              {children}
              <ToastProvider />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
