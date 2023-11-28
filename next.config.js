/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wallpapers.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3200",
        pathname: "/api/image/**",
      },
    ],
  },
  env: {
    NEXT_SOCKET_API: process.env.NEXT_SOCKET_API,
  },
};

module.exports = nextConfig;
