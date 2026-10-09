"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClientWalletButton } from "@/components/ClientWalletButton";
import { Vault, Shield, ArrowLeftRight, PieChart, Menu, X, Landmark } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Vaults", href: "/vaults", icon: Vault },
    { name: "Lend & Borrow", href: "/lend", icon: Landmark },
    { name: "Swap", href: "/swap", icon: ArrowLeftRight },
    { name: "Portfolio", href: "/portfolio", icon: PieChart },
  ];

  const isActive = (href: string) => {
    if (href === "/vaults") {
      return pathname === "/" || pathname.startsWith("/vaults");
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-8 pt-4 pb-2 backdrop-blur-md bg-[#ECEAE3]/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Pill */}
        <Link
          href="/vaults"
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs hover:bg-[#EBE9DF] transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-[#2E5627] flex items-center justify-center text-[#F8F7F3]">
            <Shield className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span className="font-serif italic font-semibold text-lg text-[#1D221C] tracking-tight">
            nexus.vault
          </span>
        </Link>

        {/* Center: Floating Navigation Pill (Desktop) */}
        <nav className="hidden md:flex items-center p-1 rounded-full border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-[#DFEAD7] text-[#274C20] shadow-2xs font-semibold"
                    : "text-[#6C7065] hover:text-[#1D221C] hover:bg-[#EBE9DF]/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Network indicator + Wallet Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Solana Devnet Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DDDBCF] bg-[#F8F7F3] text-xs font-medium text-[#6C7065]">
            <span className="w-2 h-2 rounded-full bg-[#2E8B3A] animate-pulse" />
            <span>Devnet</span>
          </div>

          {/* Wallet connect */}
          <ClientWalletButton />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-[#DDDBCF] bg-[#F8F7F3] text-[#1D221C]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-3 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#DFEAD7] text-[#274C20] font-semibold"
                      : "text-[#6C7065] hover:text-[#1D221C] hover:bg-[#EBE9DF]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 mt-1 border-t border-[#E6E4D9] flex items-center justify-between px-3 text-xs text-[#6C7065]">
              <span>Network:</span>
              <span className="font-medium text-[#2E8B3A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E8B3A]" />
                Solana Devnet
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
