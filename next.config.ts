import type { NextConfig } from "next";

/** Reads the storage bucket's hostname straight from the S3 endpoint env var,
 *  so next/image keeps working if the bucket URL ever changes. */
function storageHostname(): string | null {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  if (!endpoint) return null;
  try {
    return new URL(endpoint).hostname;
  } catch {
    return null;
  }
}

const dynamicHost = storageHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fallback in case AWS_ENDPOINT_URL_S3 isn't set wherever this builds
      {
        protocol: "https",
        hostname: "br-little-flower-b127vzpz.storage.c-5.eu-central-1.aws.neon.tech",
      },
      ...(dynamicHost && dynamicHost !== "br-little-flower-b127vzpz.storage.c-5.eu-central-1.aws.neon.tech"
        ? [
          {
            protocol: "https" as const,
            hostname: dynamicHost,
          },
        ]
        : []),
    ],
  },
};

export default nextConfig;