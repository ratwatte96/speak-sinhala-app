/** @type {import('next').NextConfig} */
const nextConfig = {
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
