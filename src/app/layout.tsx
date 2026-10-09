import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import Polyfills from "@/components/Polyfills";

export const metadata: Metadata = {
  title: "Nexus Vault | The Solana Yield Optimizer",
  description:
    "Solana vaults, lending markets, and automated token swaps built with high-yield capital allocation strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900&family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300..800;1,6..72,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#ECEAE3] text-[#1D221C] antialiased selection:bg-[#DFEAD7] selection:text-[#274C20]">
        <Polyfills />
        <WalletContextProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
