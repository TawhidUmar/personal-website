import Link from 'next/link';
import Image from 'next/image';
import { Code2 } from 'lucide-react';

export interface FooterBranding {
  siteName?: string;
  logoText?: string;
  logoUrl?: string | null;
}

interface FooterProps {
  branding?: FooterBranding;
}

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/articles', label: 'Articles' },
  { href: '/contact', label: 'Contact' },
];

function renderBrandLogoText(text: string) {
  if (text.includes('.')) {
    const lastDot = text.lastIndexOf('.');
    const prefix = text.slice(0, lastDot);
    const suffix = text.slice(lastDot);
    return (
      <>
        <span>{prefix}</span>
        <span className="text-[var(--color-accent)]">{suffix}</span>
      </>
    );
  }
  return <span>{text}</span>;
}

export function Footer({ branding }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[var(--color-foreground)] transition-opacity hover:opacity-80"
          >
            {branding?.logoUrl ? (
              <div className="relative h-7 w-7 overflow-hidden rounded-md border border-[var(--color-border)]">
                <Image
                  src={branding.logoUrl}
                  alt={branding.siteName || 'Logo'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent)] text-white">
                <Code2 size={14} />
              </span>
            )}
            <span className="font-mono text-sm font-semibold">
              {renderBrandLogoText(branding?.logoText || 'portfolio.dev')}
            </span>
          </Link>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" role="list">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-[var(--color-muted)]">
            &copy; {year} {branding?.siteName ?? 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

