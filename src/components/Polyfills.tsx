"use client";

if (typeof window !== "undefined") {
  // Hack for @coral-xyz/anchor under Next.js Turbopack which expects global exports
  (window as any).global = window;
  (window as any).exports = (window as any).exports || {};
}

export default function Polyfills() {
  return null;
}
