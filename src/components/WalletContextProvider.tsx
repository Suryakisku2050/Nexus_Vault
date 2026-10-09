"use client";

import React, { useCallback, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletError } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by our app
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  // You can set 'devnet', 'testnet', or 'mainnet-beta'.
  // Our requirement is devnet.
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  // Explicitly specify the Phantom adapter to fix the unclickable UI bug in the Modal
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter()
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    // Prevent Next.js from intercepting standard adapter errors and creating fatal dev overlays
    if (error.name === 'WalletNotReadyError') {
      console.warn("Wallet is not ready or not installed.");
      return;
    }
    
    console.warn(
      `Wallet Connection Error (${error.name}):`,
      error.message ? error.message : error
    );
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
