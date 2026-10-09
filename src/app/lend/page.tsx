"use client";

import React, { useState } from "react";
import { useLend } from "@/hooks/useNexusData";
import { useToast } from "@/components/ToastProvider";
import { SupplyMarket, BorrowMarket } from "@/lib/mock-data";
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Percent,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  X,
  Coins,
  AlertTriangle,
} from "lucide-react";

export default function LendPage() {
  const {
    supplyMarkets,
    borrowMarkets,
    summary,
    supply,
    withdrawSupply,
    borrow,
    repay,
  } = useLend();
  const { showToast } = useToast();

  const [activeModal, setActiveModal] = useState<{
    type: "supply" | "withdraw" | "borrow" | "repay";
    market: SupplyMarket | BorrowMarket;
  } | null>(null);

  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Health factor display logic
  const getHealthFactorBadge = (hf: number) => {
    if (hf >= 1.5) {
      return {
        label: "Safe",
        color: "text-[#2E8B3A] bg-[#DFEAD7] border-[#CEDEC3]",
        icon: ShieldCheck,
      };
    } else if (hf >= 1.1) {
      return {
        label: "Moderate Risk",
        color: "text-[#C67D0A] bg-[#FEF3C7] border-[#FDE68A]",
        icon: AlertTriangle,
      };
    } else {
      return {
        label: "High Liquidation Risk",
        color: "text-[#B9382F] bg-[#FEE2E2] border-[#FECACA]",
        icon: ShieldAlert,
      };
    }
  };

  const healthBadge = getHealthFactorBadge(summary.healthFactor);
  const BadgeIcon = healthBadge.icon;

  const handleModalSubmit = async () => {
    if (!activeModal) return;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    setLoading(true);
    try {
      if (activeModal.type === "supply") {
        await supply(activeModal.market.symbol, num);
        showToast({
          type: "success",
          title: "Supplied Successfully",
          description: `Supplied ${num} ${activeModal.market.symbol} as collateral`,
          txId: `tx_sup_${Date.now()}`,
        });
      } else if (activeModal.type === "withdraw") {
        await withdrawSupply(activeModal.market.symbol, num);
        showToast({
          type: "success",
          title: "Withdrawal Successful",
          description: `Withdrew ${num} ${activeModal.market.symbol}`,
          txId: `tx_wth_${Date.now()}`,
        });
      } else if (activeModal.type === "borrow") {
        await borrow(activeModal.market.symbol, num);
        showToast({
          type: "success",
          title: "Borrowed Successfully",
          description: `Borrowed ${num} ${activeModal.market.symbol}`,
          txId: `tx_bor_${Date.now()}`,
        });
      } else if (activeModal.type === "repay") {
        await repay(activeModal.market.symbol, num);
        showToast({
          type: "success",
          title: "Repayment Successful",
          description: `Repaid ${num} ${activeModal.market.symbol}`,
          txId: `tx_rep_${Date.now()}`,
        });
      }
      setActiveModal(null);
      setAmount("");
    } catch {
      showToast({
        type: "error",
        title: "Transaction Failed",
        description: "Failed to submit transaction on Solana Devnet.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Summary Grid */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D221C]">
          Lending & Borrowing Markets
        </h1>
        <p className="text-xs text-[#6C7065] mt-1">
          Supply collateral to earn interest and borrow decentralized liquidity on Solana
        </p>
      </div>

      {/* Summary Cards with Health Factor Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Supplied */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Your Supplied Collateral</span>
            <Coins className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-medium text-[#1D221C]">
            ${summary.suppliedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#2E8B3A] font-medium block mt-1">
            Earning +7.4% Net Base Yield
          </span>
        </div>

        {/* Total Borrowed */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Your Total Borrowed</span>
            <Wallet className="w-4 h-4 text-[#6C7065]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-medium text-[#1D221C]">
            ${summary.borrowedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#6C7065] block mt-1">
            Borrow Limit: ${summary.borrowLimit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Borrow Limit Used */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Borrow Limit Used</span>
            <Percent className="w-4 h-4 text-[#6C7065]" />
          </div>
          <div className="mt-2 text-2xl font-mono font-medium text-[#1D221C]">
            {summary.borrowLimitUsed.toFixed(1)}%
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full rounded-full bg-[#EBE9DF] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                summary.borrowLimitUsed > 80
                  ? "bg-[#B9382F]"
                  : summary.borrowLimitUsed > 50
                  ? "bg-[#C67D0A]"
                  : "bg-[#2E5627]"
              }`}
              style={{ width: `${Math.min(100, summary.borrowLimitUsed)}%` }}
            />
          </div>
        </div>

        {/* Health Factor Indicator */}
        <div className="p-5 rounded-2xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#6C7065] font-medium">
            <span>Health Factor</span>
            <BadgeIcon className="w-4 h-4 text-[#2E5627]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#1D221C]">
              {summary.healthFactor > 100 ? "∞" : summary.healthFactor.toFixed(2)}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${healthBadge.color}`}
            >
              {healthBadge.label}
            </span>
          </div>
          <span className="text-[11px] text-[#94998E] block mt-1">
            Liquidation threshold triggers at &lt; 1.00
          </span>
        </div>
      </div>

      {/* 2. Supply Markets Table */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl font-normal text-[#1D221C]">
          Supply Markets
        </h2>
        <div className="rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E4D9] text-[11px] font-semibold uppercase tracking-wider text-[#94998E] bg-[#F3F1EB]/50">
                  <th className="py-4 px-6">Asset</th>
                  <th className="py-4 px-6">Supply APY</th>
                  <th className="py-4 px-6">Total Supplied</th>
                  <th className="py-4 px-6">Wallet Balance</th>
                  <th className="py-4 px-6">Your Supplied</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4D9]">
                {supplyMarkets.map((market) => (
                  <tr key={market.symbol} className="hover:bg-[#EBE9DF]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={market.icon}
                          alt={market.symbol}
                          className="w-9 h-9 rounded-full border border-[#DDDBCF]"
                        />
                        <div>
                          <span className="font-semibold text-sm text-[#1D221C] block">
                            {market.name}
                          </span>
                          <span className="text-xs text-[#94998E] font-mono">
                            {market.symbol}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-sm">
                      <span className="font-semibold text-[#2E8B3A]">
                        {market.supplyApy.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono text-sm text-[#1D221C]">
                      ${(market.totalSupplied / 1000000).toFixed(2)}M
                    </td>

                    <td className="py-4 px-6 font-mono text-sm text-[#6C7065]">
                      {market.walletBalance.toLocaleString()} {market.symbol}
                    </td>

                    <td className="py-4 px-6 font-mono text-sm text-[#1D221C] font-medium">
                      {market.userSupplied.toLocaleString()} {market.symbol}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setActiveModal({ type: "supply", market })}
                          className="py-1.5 px-3.5 rounded-xl bg-[#2E5627] hover:bg-[#23461D] text-white text-xs font-semibold transition-all shadow-2xs"
                        >
                          Supply
                        </button>
                        {market.userSupplied > 0 && (
                          <button
                            onClick={() => setActiveModal({ type: "withdraw", market })}
                            className="py-1.5 px-3.5 rounded-xl bg-[#EBE9DF] hover:bg-[#DDDBCF] text-[#1D221C] text-xs font-semibold transition-all shadow-2xs"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Borrow Markets Table */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl font-normal text-[#1D221C]">
          Borrow Markets
        </h2>
        <div className="rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E4D9] text-[11px] font-semibold uppercase tracking-wider text-[#94998E] bg-[#F3F1EB]/50">
                  <th className="py-4 px-6">Asset</th>
                  <th className="py-4 px-6">Borrow APY</th>
                  <th className="py-4 px-6">Available Liquidity</th>
                  <th className="py-4 px-6">Total Borrowed</th>
                  <th className="py-4 px-6">Your Borrowed</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4D9]">
                {borrowMarkets.map((market) => (
                  <tr key={market.symbol} className="hover:bg-[#EBE9DF]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={market.icon}
                          alt={market.symbol}
                          className="w-9 h-9 rounded-full border border-[#DDDBCF]"
                        />
                        <div>
                          <span className="font-semibold text-sm text-[#1D221C] block">
                            {market.name}
                          </span>
                          <span className="text-xs text-[#94998E] font-mono">
                            {market.symbol}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-sm">
                      <span className="font-semibold text-[#C67D0A]">
                        {market.borrowApy.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono text-sm text-[#1D221C]">
                      ${(market.availableLiquidity / 1000000).toFixed(2)}M
                    </td>

                    <td className="py-4 px-6 font-mono text-sm text-[#6C7065]">
                      ${(market.totalBorrowed / 1000000).toFixed(2)}M
                    </td>

                    <td className="py-4 px-6 font-mono text-sm text-[#1D221C] font-medium">
                      {market.userBorrowed.toLocaleString()} {market.symbol}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setActiveModal({ type: "borrow", market })}
                          className="py-1.5 px-3.5 rounded-xl bg-[#EBE9DF] hover:bg-[#2E5627] text-[#1D221C] hover:text-white text-xs font-semibold transition-all shadow-2xs"
                        >
                          Borrow
                        </button>
                        {market.userBorrowed > 0 && (
                          <button
                            onClick={() => setActiveModal({ type: "repay", market })}
                            className="py-1.5 px-3.5 rounded-xl bg-[#2E5627] hover:bg-[#23461D] text-white text-xs font-semibold transition-all shadow-2xs"
                          >
                            Repay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lending & Borrowing Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#F8F7F3] border border-[#DDDBCF] rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E4D9]">
              <div className="flex items-center gap-3">
                <img
                  src={activeModal.market.icon}
                  alt={activeModal.market.symbol}
                  className="w-10 h-10 rounded-full border border-[#DDDBCF]"
                />
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#1D221C] capitalize">
                    {activeModal.type} {activeModal.market.symbol}
                  </h3>
                  <span className="text-xs text-[#6C7065]">
                    {activeModal.market.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setAmount("");
                }}
                className="p-1.5 rounded-full text-[#94998E] hover:text-[#1D221C] hover:bg-[#EBE9DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6C7065]">
                <span>Amount</span>
                <span>
                  Max Available:{" "}
                  <strong className="text-[#1D221C] font-mono">
                    {activeModal.type === "supply"
                      ? (activeModal.market as SupplyMarket).walletBalance
                      : activeModal.type === "withdraw"
                      ? (activeModal.market as SupplyMarket).userSupplied
                      : activeModal.type === "borrow"
                      ? "2,500.00"
                      : (activeModal.market as BorrowMarket).userBorrowed}{" "}
                    {activeModal.market.symbol}
                  </strong>
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EBE9DF]/70 border border-[#DDDBCF] focus-within:border-[#2E5627]">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-2xl font-mono font-medium text-[#1D221C] outline-none w-full"
                />
                <button
                  onClick={() => {
                    const maxVal =
                      activeModal.type === "supply"
                        ? (activeModal.market as SupplyMarket).walletBalance
                        : activeModal.type === "withdraw"
                        ? (activeModal.market as SupplyMarket).userSupplied
                        : activeModal.type === "borrow"
                        ? 2500
                        : (activeModal.market as BorrowMarket).userBorrowed;
                    setAmount(maxVal.toString());
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#F8F7F3] border border-[#DDDBCF] text-xs font-semibold text-[#1D221C] shrink-0"
                >
                  MAX
                </button>
              </div>

              {/* Health factor impact simulation */}
              <div className="p-3.5 rounded-xl bg-[#EBE9DF]/50 border border-[#DDDBCF] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6C7065]">Current Health Factor:</span>
                  <span className="font-mono font-semibold text-[#2E8B3A]">
                    {summary.healthFactor > 100 ? "∞" : summary.healthFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C7065]">Projected Health Factor:</span>
                  <span className="font-mono font-semibold text-[#1D221C]">
                    {activeModal.type === "borrow" ? "2.10 (Safe)" : "2.85 (Safe)"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleModalSubmit}
              disabled={loading || parseFloat(amount) <= 0}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2E5627] hover:bg-[#23461D] disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Solana Devnet...</span>
                </>
              ) : (
                <span className="capitalize">Confirm {activeModal.type}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
