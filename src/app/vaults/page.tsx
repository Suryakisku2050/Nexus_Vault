"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVaults } from "@/hooks/useNexusData";
import { Vault } from "@/lib/mock-data";
import { QuickDepositModal } from "@/components/QuickDepositModal";
import {
  Search,
  Filter,
  ArrowUpDown,
  Coins,
  TrendingUp,
  Wallet,
  Sparkles,
  Plus,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

export default function VaultsPage() {
  const router = useRouter();
  const {
    vaults,
    allVaults,
    stats,
    protocols,
    assets,
    search,
    setSearch,
    selectedProtocol,
    setSelectedProtocol,
    selectedAsset,
    setSelectedAsset,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useVaults();

  const [selectedVaultForModal, setSelectedVaultForModal] = useState<Vault | null>(null);

  const toggleSort = (type: "tvl" | "apy") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(type);
      setSortOrder("desc");
    }
  };

  const featuredVaults = allVaults.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total TVL */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs backyard-card-bg">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Total Platform TVL</span>
            <Coins className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-mono font-medium text-[#1D221C]">
            ${stats.totalTvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#2E8B3A]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% across Solana Devnet this week</span>
          </div>
        </div>

        {/* Your Deposits */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Your Total Deposits</span>
            <Wallet className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-mono font-medium text-[#1D221C]">
            ${stats.userDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-[#6C7065]">
            Active across {allVaults.filter((v) => v.userDeposit > 0).length} strategies
          </div>
        </div>

        {/* Your Earnings */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Your Total Earnings</span>
            <Sparkles className="w-4 h-4 text-[#2E8B3A]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-mono font-medium text-[#2E8B3A]">
            +${stats.userEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-[#6C7065]">
            Auto-compounding real-time yield
          </div>
        </div>
      </div>

      {/* 2. Top Featured Vaults Carousel/Cards (Identical to Backyard Finance) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold text-[#1D221C] uppercase tracking-wider">
            Featured Strategies
          </h2>
          <span className="text-xs text-[#6C7065]">Curated Yield Allocations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredVaults.map((vault) => (
            <div
              key={vault.id}
              className="group p-5 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs backyard-card-bg hover:border-[#2E5627]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Protocol Pill */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBE9DF] border border-[#DDDBCF] text-[11px] font-medium text-[#1D221C]">
                    <span>{vault.protocolIcon}</span>
                    <span>{vault.protocol}</span>
                  </div>
                  <span className="text-[11px] text-[#94998E] font-mono">{vault.assetSymbol}</span>
                </div>

                {/* Vault Title */}
                <Link href={`/vaults/${vault.id}`}>
                  <h3 className="mt-4 font-serif text-2xl font-normal text-[#1D221C] group-hover:text-[#2E5627] transition-colors leading-tight line-clamp-1">
                    {vault.name}
                  </h3>
                </Link>

                {/* APY & TVL display */}
                <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-[#E6E4D9]">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6C7065] block">
                      APY
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-xl font-medium text-[#1D221C]">
                        {vault.apy.toFixed(2)}%
                      </span>
                      <span className="w-4 h-4 rounded-full bg-[#DFEAD7] text-[#274C20] flex items-center justify-center text-[10px] font-bold">
                        +
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6C7065] block">
                      TVL
                    </span>
                    <div className="flex items-center gap-1 mt-0.5 text-[#1D221C] font-mono text-sm font-medium">
                      <span>${(vault.tvl / 1000000).toFixed(2)}M</span>
                      <Coins className="w-3.5 h-3.5 text-[#94998E]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedVaultForModal(vault)}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-[#EBE9DF] hover:bg-[#2E5627] text-[#1D221C] hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to strategy</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Search and Filters Bar */}
      <div className="pt-2">
        <div className="p-2 sm:p-3 rounded-2xl sm:rounded-full border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3 flex-1">
            <Search className="w-4 h-4 text-[#94998E] shrink-0" />
            <input
              type="text"
              placeholder="Search for vault or asset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[#1D221C] placeholder:text-[#94998E] outline-none w-full"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 px-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Protocol Filter */}
            <div className="relative">
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-full border border-[#DDDBCF] bg-[#EBE9DF]/70 text-xs font-medium text-[#1D221C] outline-none cursor-pointer hover:bg-[#EBE9DF] transition-colors"
              >
                <option value="all">All Protocols</option>
                {protocols.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#6C7065] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Asset Filter */}
            <div className="relative">
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-full border border-[#DDDBCF] bg-[#EBE9DF]/70 text-xs font-medium text-[#1D221C] outline-none cursor-pointer hover:bg-[#EBE9DF] transition-colors"
              >
                <option value="all">All Assets</option>
                {assets.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#6C7065] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => toggleSort("apy")}
              className={`px-3 py-1.5 rounded-full border border-[#DDDBCF] text-xs font-medium transition-colors flex items-center gap-1 shrink-0 ${
                sortBy === "apy"
                  ? "bg-[#DFEAD7] text-[#274C20] font-semibold border-[#2E5627]/30"
                  : "bg-[#EBE9DF]/70 text-[#1D221C] hover:bg-[#EBE9DF]"
              }`}
            >
              <span>APY {sortBy === "apy" ? (sortOrder === "desc" ? "↓" : "↑") : ""}</span>
            </button>

            <button
              onClick={() => toggleSort("tvl")}
              className={`px-3 py-1.5 rounded-full border border-[#DDDBCF] text-xs font-medium transition-colors flex items-center gap-1 shrink-0 ${
                sortBy === "tvl"
                  ? "bg-[#DFEAD7] text-[#274C20] font-semibold border-[#2E5627]/30"
                  : "bg-[#EBE9DF]/70 text-[#1D221C] hover:bg-[#EBE9DF]"
              }`}
            >
              <span>TVL {sortBy === "tvl" ? (sortOrder === "desc" ? "↓" : "↑") : ""}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Vaults Table (Backyard Style) */}
      <div className="rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E4D9] text-[11px] font-semibold uppercase tracking-wider text-[#94998E] bg-[#F3F1EB]/50">
                <th className="py-4 px-6">Vault</th>
                <th className="py-4 px-6">Protocol</th>
                <th
                  onClick={() => toggleSort("tvl")}
                  className="py-4 px-6 cursor-pointer hover:text-[#1D221C] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>TVL</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("apy")}
                  className="py-4 px-6 cursor-pointer hover:text-[#1D221C] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>APY</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4D9]">
              {vaults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6C7065]">
                    No vaults found matching your filters.
                  </td>
                </tr>
              ) : (
                vaults.map((vault) => (
                  <tr
                    key={vault.id}
                    className="hover:bg-[#EBE9DF]/40 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/vaults/${vault.id}`)}
                  >
                    {/* Vault Name + Asset Icon */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={vault.assetIcon}
                          alt={vault.assetSymbol}
                          className="w-9 h-9 rounded-full border border-[#DDDBCF] shrink-0"
                        />
                        <div>
                          <div className="font-medium text-[#1D221C] group-hover:text-[#2E5627] transition-colors flex items-center gap-1.5">
                            <span>{vault.name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#2E5627]" />
                          </div>
                          <span className="text-xs text-[#94998E] font-mono">
                            {vault.assetSymbol}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Protocol */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBE9DF] border border-[#DDDBCF] text-xs font-medium text-[#1D221C]">
                        <span>{vault.protocolIcon}</span>
                        <span>{vault.protocol}</span>
                      </span>
                    </td>

                    {/* TVL */}
                    <td className="py-4 px-6 font-mono text-sm text-[#1D221C]">
                      <div className="flex items-center gap-1.5">
                        <span>
                          ${vault.tvl.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <Coins className="w-3.5 h-3.5 text-[#94998E]" />
                      </div>
                    </td>

                    {/* APY */}
                    <td className="py-4 px-6 font-mono text-sm">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="font-semibold text-[#1D221C]">
                          {vault.apy.toFixed(2)}%
                        </span>
                        <span className="w-4 h-4 rounded-full bg-[#DFEAD7] text-[#274C20] flex items-center justify-center text-[10px] font-bold">
                          +
                        </span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVaultForModal(vault);
                        }}
                        className="py-1.5 px-3.5 rounded-xl bg-[#EBE9DF] hover:bg-[#2E5627] text-[#1D221C] hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to strategy</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Deposit Modal */}
      <QuickDepositModal
        vault={selectedVaultForModal}
        isOpen={!!selectedVaultForModal}
        onClose={() => setSelectedVaultForModal(null)}
      />
    </div>
  );
}
