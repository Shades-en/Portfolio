import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { TooltipProvider } from '@/components/ui/tooltip';
import { publicUrl } from "@/constants";
import personalInfo from "@/data/personal-info.json";

const myUrl = process.env.NEXT_PUBLIC_SITE_URL || publicUrl;

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  metadataBase: new URL(myUrl),
  alternates: {
    canonical: myUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: myUrl,
    title: personalInfo.seo.title,
    description: personalInfo.seo.description,
    siteName: personalInfo.seo.title,
    images: [{
      url: personalInfo.seo.ogImage,
      width: 1200,
      height: 630,
      alt: personalInfo.seo.title,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: personalInfo.seo.title,
    description: personalInfo.seo.description,
    images: [personalInfo.seo.ogImage],
  },

};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
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
              "url": myUrl,
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
