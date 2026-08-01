/** @type {import('next').NextConfig} */
const nextConfig = {
  // We want to serve the Vite build as our frontend.
  // Next.js will handle the /api routes automatically.
  async rewrites() {
    return [
      // Exclude /api from the rewrite
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        destination: '/index.html',
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: wss:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
