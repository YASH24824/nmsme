/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.2.56",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
    