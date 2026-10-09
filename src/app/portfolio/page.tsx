"use client";

import React from "react";
import Link from "next/link";
import { useVaults, useLend } from "@/hooks/useNexusData";
import { useToast } from "@/components/ToastProvider";
import {
  Wallet,
  Coins,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from "lucide-react";

export default function PortfolioPage() {
  const { allVaults, claim } = useVaults();
  const { summary, supplyMarkets, borrowMarkets } = useLend();
  const { showToast } = useToast();

  const userVaultPositions = allVaults.filter((v) => v.userDeposit > 0);
  const userSupplyPositions = supplyMarkets.filter((m) => m.userSupplied > 0);
  const userBorrowPositions = borrowMarkets.filter((m) => m.userBorrowed > 0);

  const totalVaultDeposits = userVaultPositions.reduce((acc, v) => acc + v.userDeposit, 0);
  const totalVaultEarnings = userVaultPositions.reduce((acc, v) => acc + v.userEarnings, 0);

  const totalNetWorth =
    totalVaultDeposits + summary.suppliedUsd - summary.borrowedUsd;

  const handleClaimAll = async () => {
    if (totalVaultEarnings <= 0) {
      showToast({
        type: "info",
        title: "No Yield to Claim",
        description: "You have no accrued yield to claim right now.",
      });
      return;
    }

    for (const pos of userVaultPositions) {
      if (pos.userEarnings > 0) {
        await claim(pos.id);
      }
    }

    showToast({
      type: "success",
      title: "All Rewards Claimed",
      description: `Successfully claimed $${totalVaultEarnings.toFixed(2)} across all positions.`,
      txId: `tx_clmall_${Date.now()}`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Claim All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D221C]">
            Your Portfolio
          </h1>
          <p className="text-xs text-[#6C7065] mt-1">
            Real-time tracking of active vault allocations, collateral deposits, and debt
          </p>
        </div>

        <button
          onClick={handleClaimAll}
          className="px-5 py-2.5 rounded-full bg-[#2E5627] hover:bg-[#23461D] text-white text-xs font-semibold transition-all inline-flex items-center gap-2 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[#DFEAD7]" />
          <span>Claim All Accrued Yield (${totalVaultEarnings.toFixed(2)})</span>
        </button>
      </div>

      {/* 2. Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs backyard-card-bg">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Net Portfolio Value</span>
            <Wallet className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-medium text-[#1D221C]">
            ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#2E8B3A] font-medium block mt-1">
            +$84.20 (+3.2%) this month
          </span>
        </div>

        {/* Vault Deposits */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Vault Deposits</span>
            <Coins className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-medium text-[#1D221C]">
            ${totalVaultDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#6C7065] block mt-1">
            Across {userVaultPositions.length} active vaults
          </span>
        </div>

        {/* Unclaimed Yield */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Claimable Yield</span>
            <Sparkles className="w-4 h-4 text-[#2E8B3A]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-medium text-[#2E8B3A]">
            +${totalVaultEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#2E8B3A] block mt-1">
            Ready to claim
          </span>
        </div>

        {/* Health Factor */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Health Factor</span>
            <ShieldCheck className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-[#1D221C]">
            {summary.healthFactor > 100 ? "∞" : summary.healthFactor.toFixed(2)}
          </div>
          <span className="text-[11px] text-[#2E8B3A] font-semibold block mt-1">
            Safe • No Liquidation Risk
          </span>
        </div>
      </div>

      {/* 3. Active Vault Allocations Table */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl font-normal text-[#1D221C]">
          Active Vault Positions
        </h2>

        <div className="rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E4D9] text-[11px] font-semibold uppercase tracking-wider text-[#94998E] bg-[#F3F1EB]/50">
                  <th className="py-4 px-6">Vault Strategy</th>
                  <th className="py-4 px-6">Deposited</th>
                  <th className="py-4 px-6">APY</th>
                  <th className="py-4 px-6">Accrued Yield</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4D9]">
                {userVaultPositions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#6C7065]">
                      You have no active vault positions.{" "}
                      <Link href="/vaults" className="text-[#2E5627] font-semibold underline ml-1">
                        Explore Vaults
                      </Link>
                    </td>
                  </tr>
                ) : (
                  userVaultPositions.map((pos) => (
                    <tr key={pos.id} className="hover:bg-[#EBE9DF]/40 transition-colors">
                      <td className="py-4 px-6">
                        <Link href={`/vaults/${pos.id}`} className="flex items-center gap-3 group">
                          <img
                            src={pos.assetIcon}
                            alt=""
                            className="w-9 h-9 rounded-full border border-[#DDDBCF]"
                          />
                          <div>
                            <span className="font-semibold text-sm text-[#1D221C] group-hover:text-[#2E5627] transition-colors flex items-center gap-1">
                              {pos.name}
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <span className="text-xs text-[#94998E] font-mono">
                              {pos.protocol} • {pos.assetSymbol}
                            </span>
                          </div>
                        </Link>
                      </td>

                      <td className="py-4 px-6 font-mono text-sm text-[#1D221C]">
                        ${pos.userDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                        {pos.assetSymbol}
                      </td>

                      <td className="py-4 px-6 font-mono text-sm">
                        <span className="font-semibold text-[#1D221C]">
                          {pos.apy.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-sm text-[#2E8B3A] font-semibold">
                        +${pos.userEarnings.toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/vaults/${pos.id}`}
                            className="py-1.5 px-3 rounded-xl bg-[#EBE9DF] hover:bg-[#DDDBCF] text-[#1D221C] text-xs font-semibold transition-all"
                          >
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Active Lending & Borrowing Positions */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl font-normal text-[#1D221C]">
          Lending Collateral & Borrowed Debt
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supplied Collateral */}
          <div className="p-6 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1D221C]">
              Supplied Collateral
            </h3>
            {userSupplyPositions.length === 0 ? (
              <p className="text-xs text-[#6C7065]">No collateral supplied yet.</p>
            ) : (
              <div className="divide-y divide-[#E6E4D9]">
                {userSupplyPositions.map((m) => (
                  <div key={m.symbol} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={m.icon} alt="" className="w-6 h-6 rounded-full" />
                      <div>
                        <span className="font-medium text-[#1D221C] block">{m.name}</span>
                        <span className="text-[#94998E] font-mono">{m.symbol}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-medium text-[#1D221C] block">
                        {m.userSupplied.toLocaleString()} {m.symbol}
                      </span>
                      <span className="text-[#2E8B3A] font-mono font-semibold">
                        +{m.supplyApy}% APY
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Borrowed Debt */}
          <div className="p-6 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1D221C]">
              Borrowed Debt
            </h3>
            {userBorrowPositions.length === 0 ? (
              <p className="text-xs text-[#6C7065]">No debt borrowed yet.</p>
            ) : (
              <div className="divide-y divide-[#E6E4D9]">
                {userBorrowPositions.map((m) => (
                  <div key={m.symbol} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={m.icon} alt="" className="w-6 h-6 rounded-full" />
                      <div>
                        <span className="font-medium text-[#1D221C] block">{m.name}</span>
                        <span className="text-[#94998E] font-mono">{m.symbol}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-medium text-[#1D221C] block">
                        {m.userBorrowed.toLocaleString()} {m.symbol}
                      </span>
                      <span className="text-[#C67D0A] font-mono font-semibold">
                        {m.borrowApy}% Borrow APY
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
