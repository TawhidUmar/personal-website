import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CommandPalette } from '@/components/public/CommandPalette';
import { getPublicBranding } from '@/lib/services/public-data.service';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branding = await getPublicBranding();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-medium shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Skip to main content
      </a>
      <Navbar branding={branding} />
      <main id="main-content">
        {children}
      </main>
      <Footer branding={branding} />
      <CommandPalette />
    </>
  );
}

