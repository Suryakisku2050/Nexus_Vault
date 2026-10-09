"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the WalletMultiButton to prevent hydration mismatch errors.
// Next.js static rendering would otherwise struggle translating the client-side wallet state to HTML.
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the shape of the button while loading to prevent CLS
    return (
      <button className="px-5 py-2.5 rounded-lg bg-[var(--surface-hover)] text-transparent font-medium border border-[var(--border)] hidden sm:block animate-pulse w-[150px] h-[45px]">
        Loading
      </button>
    );
  }

  // We add some custom CSS via styles.css or Tailwind to style the Solana button nicely.
  // The standard .wallet-adapter-button class comes from their CSS.
  return (
    <div className="nexus-wallet-btn">
      <WalletMultiButtonDynamic />
    </div>
  );
}
