import type { NextConfig } from "next";

/** Project Pages live at /repo-name; user sites and local builds use "". */
function pagesBasePath() {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!raw || raw === "/") return "";
  return raw.startsWith("/") ? raw.replace(/\/$/, "") : `/${raw.replace(/\/$/, "")}`;
}

const basePath = pagesBasePath();

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
