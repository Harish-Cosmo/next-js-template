/**
 * Next.js configuration.
 *
 * Kept deliberately small. Every option here earns its place; adding one
 * "just in case" is how a fast starter becomes a slow one.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  /* Do not advertise the framework. */
  poweredByHeader: false,

  /* No trailing slashes: /pricing, not /pricing/. Canonicals, sitemap URLs
     and internal links must agree with this. */
  trailingSlash: false,

  experimental: {
    /* Tree-shake large barrel packages. Add a package only if the bundle
       actually shrinks. */
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  /* Pin the workspace root. Without this Turbopack can walk up and find a
     stray lockfile outside the repo, which makes builds non-deterministic. */
  turbopack: {
    root: import.meta.dirname,
  },

  /* Safe, boring security headers. A template should not ship a restrictive
     CSP it cannot maintain; add one when you know every origin you use. */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
