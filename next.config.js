// https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
// https://github.com/vercel/next.js/discussions/12124

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  webpack(config) {
    config.resolve.fallback = {
      fs: false, // the solution to can't find 'fs' module
    };
    
    return config;
  },
}
 
module.exports = nextConfig