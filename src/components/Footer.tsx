import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-[#DDDBCF] bg-[#ECEAE3]/60 pt-12 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#2E5627] flex items-center justify-center text-[#F8F7F3]">
            <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="font-serif italic font-semibold text-lg text-[#1D221C]">
            nexus.vault
          </span>
          <span className="text-xs text-[#94998E] ml-2">Solana Yield Infrastructure</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#6C7065]">
          <Link href="/vaults" className="hover:text-[#1D221C] transition-colors">
            Vaults
          </Link>
          <Link href="/lend" className="hover:text-[#1D221C] transition-colors">
            Markets
          </Link>
          <Link href="/swap" className="hover:text-[#1D221C] transition-colors">
            Swap
          </Link>
          <Link href="/portfolio" className="hover:text-[#1D221C] transition-colors">
            Portfolio
          </Link>
          <a
            href="https://github.com/Suryakisku2050/Nexus_Vault"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1D221C] transition-colors"
          >
            GitHub
          </a>
          <span className="hover:text-[#1D221C] cursor-pointer">Docs</span>
        </div>

        {/* Right */}
        <div className="text-xs text-[#94998E]">
          © {new Date().getFullYear()} Nexus Vault. Built on Solana Devnet.
        </div>
      </div>
    </footer>
  );
}
