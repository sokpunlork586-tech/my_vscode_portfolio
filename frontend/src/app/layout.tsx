import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/theme/icons';
import JssRegistry from '@/components/JssRegistry';
import MainLayout from '@/layouts/Main';
import { tabs } from '@/data';
import contactData from '@/data/json/contact.json';
import metadataJson from '@/data/json/metadata.json';

export const viewport: Viewport = {
  themeColor: metadataJson.themeColor,
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: metadataJson.title,
    template: `%s • ${metadataJson.title}`,
  },
  description: metadataJson.description,
  keywords: metadataJson.keywords.split(',').map((k) => k.trim()),
  metadataBase: new URL(metadataJson.homepage),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: metadataJson.title,
    description: metadataJson.description,
    type: 'website',
    url: metadataJson.homepage,
    images: [
      {
        url: metadataJson.image,
        width: 320,
        height: 320,
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: metadataJson.homepage,
    title: metadataJson.title,
    description: metadataJson.description,
    images: [metadataJson.image],
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: metadataJson.verification.google,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&family=Ubuntu+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JssRegistry>
          <MainLayout tabs={tabs} contactData={contactData}>
            {children}
          </MainLayout>
        </JssRegistry>
      </body>
    </html>
  );
}
