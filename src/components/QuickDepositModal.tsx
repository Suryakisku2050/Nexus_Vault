"use client";

import React, { useState } from "react";
import { Vault } from "@/lib/mock-data";
import { useToast } from "@/components/ToastProvider";
import { X, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface QuickDepositModalProps {
  vault: Vault | null;
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess?: () => void;
}

export function QuickDepositModal({
  vault,
  isOpen,
  onClose,
  onDepositSuccess,
}: QuickDepositModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  if (!isOpen || !vault) return null;

  const mockWalletBalance = 2450.5; // USDC mock wallet balance

  const handleQuickPercent = (pct: number) => {
    const val = (mockWalletBalance * pct).toFixed(2);
    setAmount(val);
  };

  const handleDeposit = async () => {
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
      // Simulate on-chain transaction
      await new Promise((r) => setTimeout(r, 1200));
      vault.userDeposit += num;
      vault.tvl += num;

      showToast({
        type: "success",
        title: "Deposit Successful",
        description: `Successfully deposited ${num.toLocaleString()} ${vault.assetSymbol} into ${vault.name}`,
        txId: `5ePz${Math.random().toString(36).substring(2, 8)}...Devnet`,
      });

      onDepositSuccess?.();
      onClose();
      setAmount("");
    } catch {
      showToast({
        type: "error",
        title: "Transaction Failed",
        description: "An error occurred while confirming on Solana Devnet.",
      });
    } finally {
      setLoading(false);
    }
  };

  const parsedAmount = parseFloat(amount) || 0;
  const estAnnualYield = (parsedAmount * (vault.apy / 100)).toFixed(2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#F8F7F3] border border-[#DDDBCF] rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150 relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E6E4D9]">
          <div className="flex items-center gap-3">
            <img
              src={vault.assetIcon}
              alt={vault.assetSymbol}
              className="w-10 h-10 rounded-full border border-[#DDDBCF]"
            />
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6C7065]">
                {vault.protocol} Vault
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#1D221C]">
                {vault.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94998E] hover:text-[#1D221C] hover:bg-[#EBE9DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6C7065]">
            <span>Deposit Amount</span>
            <span>
              Bal:{" "}
              <strong className="text-[#1D221C] font-mono">
                {mockWalletBalance.toLocaleString()} {vault.assetSymbol}
              </strong>
            </span>
          </div>

          {/* Amount input card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EBE9DF]/70 border border-[#DDDBCF] focus-within:border-[#2E5627] transition-colors">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-2xl font-mono font-medium text-[#1D221C] outline-none w-full placeholder:text-[#94998E]"
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F3] border border-[#DDDBCF] text-xs font-semibold text-[#1D221C] shrink-0">
              <img
                src={vault.assetIcon}
                alt=""
                className="w-4 h-4 rounded-full"
              />
              {vault.assetSymbol}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                onClick={() => handleQuickPercent(pct)}
                className="py-1.5 text-xs font-medium rounded-lg bg-[#EBE9DF]/60 hover:bg-[#EBE9DF] border border-[#DDDBCF] text-[#1D221C] transition-colors"
              >
                {pct === 1.0 ? "MAX" : `${pct * 100}%`}
              </button>
            ))}
          </div>

          {/* Yield Projection */}
          <div className="p-3 rounded-xl bg-[#DFEAD7]/50 border border-[#CEDEC3] text-xs text-[#274C20] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2E8B3A]" />
              Projected Annual Yield ({vault.apy}% APY):
            </span>
            <span className="font-mono font-bold">
              +{estAnnualYield} {vault.assetSymbol}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#6C7065] pt-1">
            <div className="flex justify-between">
              <span>Strategy:</span>
              <span className="text-[#1D221C] font-medium">{vault.tags[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Performance Fee:</span>
              <span className="text-[#1D221C] font-medium">{vault.performanceFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Cooldown Period:</span>
              <span className="text-[#1D221C] font-medium">{vault.cooldown}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDeposit}
          disabled={loading || parsedAmount <= 0}
          className="w-full py-3.5 px-4 rounded-xl bg-[#2E5627] hover:bg-[#23461D] disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming on Devnet...</span>
            </>
          ) : (
            <>
              <span>Deposit {vault.assetSymbol}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
