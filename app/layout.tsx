import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export const metadata: Metadata = {
  /* Required. Without it every OG image and canonical resolves relative. */
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seoTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.seoDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  robots: siteConfig.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  /* No default canonical: each page sets its own through pageMetadata().
     A default here makes the 404 page claim to be the home page. */
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    locale: siteConfig.locale,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: siteConfig.seoTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seoTitle,
    description: siteConfig.seoDescription,
    images: ['/opengraph-image'],
    ...(siteConfig.twitter ? { site: siteConfig.twitter } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.lang}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/*
          [container-type:inline-size] is required: the fluid type utilities
          in globals.css use cqi units and collapse without a container
          ancestor. Same contract as the rest of the design system.
        */}
        <div className="flex min-h-screen flex-col [container-type:inline-size]">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
