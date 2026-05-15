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
};

export default nextConfig;
