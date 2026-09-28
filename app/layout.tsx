import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import '@/app/globals.css';

// ── Fonts ──────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const geistMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
});

// ── Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tawhidulislam.me'
  ),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Md Tawhidul Islam',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME ?? 'Md Tawhidul Islam'}`,
  },
  description:
    'Personal portfolio, AI/ML research profile, and technical blog.',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tawhidulislam.me',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Md Tawhidul Islam',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#07070f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// ── Root Layout ─────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Inline theme script to prevent FOUC */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('ps-theme');
                var d = document.documentElement;
                var isDark = t === 'dark' || ((!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  d.classList.add('dark');
                  d.classList.remove('light');
                } else {
                  d.classList.remove('dark');
                  d.classList.add('light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
