import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    // Uploaded photos are served by Payload from /api/media/file/... on this same server.
    localPatterns: [{ pathname: '/api/media/file/**' }],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1080, 1440, 1920, 2560],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    // Run `npm run generate:types && npm run typecheck` to type-check separately.
    // Kept off during `next build` so a typing nit never blocks a deploy on the home server.
    ignoreBuildErrors: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
