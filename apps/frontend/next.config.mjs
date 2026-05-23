/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Prevent dev-only CSS chunking bugs during HMR / client navigation.
    // https://github.com/vercel/next.js/issues/64404
    if (dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'CssChunkingPlugin',
      );
    }

    return config;
  },
};

export default nextConfig;
