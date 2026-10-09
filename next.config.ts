import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable Turbopack — @coral-xyz/anchor uses CommonJS patterns
     that Turbopack's strict ESM environment does not shim. */
};

export default nextConfig;
