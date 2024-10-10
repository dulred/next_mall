/** @type {import('next').NextConfig} */
 
const nextConfig = {
  images: {
    domains: ['localhost','via.placeholder.com','www.guagnximisa.top'],
  },
  typescript: {
    // 忽略 TypeScript 构建错误  打包需要忽略的
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
