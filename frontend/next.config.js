/** @type {import('next').NextConfig} */

const path = require('path');

// 从 API 地址自动推导图片白名单域名，避免换域名时漏改 remotePatterns
const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
let strapiHost = 'localhost';
let strapiProtocol = 'http';
let strapiPort = '';
try {
  const u = new URL(strapiApiUrl);
  strapiHost = u.hostname;
  strapiProtocol = u.protocol.replace(':', '');
  strapiPort = u.port;
} catch (e) {
  // 解析失败则回退到 localhost
}

const strapiPattern = {
  protocol: strapiProtocol,
  hostname: strapiHost,
  pathname: '/uploads/**',
};
if (strapiPort) {
  strapiPattern.port = strapiPort;
}

const nextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    remotePatterns: [
      strapiPattern,
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
}

module.exports = nextConfig
