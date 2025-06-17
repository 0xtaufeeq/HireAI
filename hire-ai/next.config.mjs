/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    swcMinify: true,
    poweredByHeader: false,

    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    },

    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
            {
                source: "/ingest/decide",
                destination: "https://us.i.posthog.com/decide",
            },
        ];
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
