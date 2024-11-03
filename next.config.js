/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
