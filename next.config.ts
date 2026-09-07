import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the on-screen dev-mode indicator (the little "N" badge) — it never
  // shows in production anyway, this just keeps local testing/screenshots
  // clean too. Next still surfaces real compile/runtime errors regardless.
  devIndicators: false,
};

export default nextConfig;
