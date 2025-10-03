/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'developers.google.com' },
      { protocol: 'https', hostname: 'www.facebook.com' },
    ],
  },
};

module.exports = nextConfig;
