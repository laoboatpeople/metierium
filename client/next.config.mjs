/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Remove this after fixing pre-existing TS errors (~50 files)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
