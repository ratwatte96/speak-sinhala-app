/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode to prevent double rendering in dev
  async redirects() {
    return [
      {
        source: "/",
        destination: "/read", // Change this to your desired route
        permanent: true, // Set to false for a temporary redirect (307)
      },
    ];
  },
};

export default nextConfig;
