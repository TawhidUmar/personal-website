import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Images ──────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      // Allow any HTTPS image provider (Cloudflare R2, image2url, S3, Unsplash, GitHub, etc.)
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'www.image2url.com' },
      { protocol: 'https', hostname: 'image2url.com' },
      { protocol: 'https', hostname: '**.image2url.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Security headers ─────────────────────────────────────────────────────
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    const headers = [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      { key: 'Content-Security-Policy', value: csp },
    ];

    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers,
      },
      {
        // Force no caching for home page
        source: '/',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        // Force no caching for all public content pages and their sub-routes
        source: '/:path(about|articles|projects|research|contact)',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/:section(articles|projects|research)/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },

  // ── Redirects ────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy paths
      { source: '/blog', destination: '/articles', permanent: true },
      { source: '/blog/:slug', destination: '/articles/:slug', permanent: true },
      { source: '/portfolio', destination: '/projects', permanent: true },
    ];
  },

  // ── Logging ──────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // ── Experimental ─────────────────────────────────────────────────────────
  experimental: {
    // Enable server actions (default in Next.js 15+)
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002'],
    },
  },
};

export default nextConfig;
