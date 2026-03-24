import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Alias canvas to empty module for pdfjs-dist compatibility
      canvas: '',
    },
  },
  // Webpack alias for non-Turbopack builds (production)
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "worker-src 'self' blob: https://cdnjs.cloudflare.com",
            "connect-src 'self' https://api.openai.com",
            "img-src 'self' data:",
            "font-src 'self' data:",
          ].join('; '),
        },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    },
  ],
};

export default nextConfig;
