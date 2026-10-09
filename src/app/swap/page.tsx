"use client";

import React, { useState } from "react";
import { useSwap } from "@/hooks/useNexusData";
import { useToast } from "@/components/ToastProvider";
import {
  ArrowDownUp,
  Settings2,
  Sparkles,
  Info,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";

export default function SwapPage() {
  const { tokens, getQuote, executeSwap } = useSwap();
  const { showToast } = useToast();

  const [fromSymbol, setFromSymbol] = useState<string>("SOL");
  const [toSymbol, setToSymbol] = useState<string>("USDC");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fromToken = tokens.find((t) => t.symbol === fromSymbol) || tokens[1];
  const toToken = tokens.find((t) => t.symbol === toSymbol) || tokens[0];

  const parsedFrom = parseFloat(fromAmount) || 0;
  const quote = getQuote(fromSymbol, toSymbol, parsedFrom);

  const handleFlip = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setFromAmount("");
  };

  const handleQuickPercent = (pct: number) => {
    setFromAmount((fromToken.balance * pct).toFixed(3));
  };

  const handleSwap = async () => {
    if (parsedFrom <= 0) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        description: "Please enter an amount to swap.",
      });
      return;
    }

    if (parsedFrom > fromToken.balance) {
      showToast({
        type: "error",
        title: "Insufficient Balance",
        description: `You only have ${fromToken.balance} ${fromToken.symbol} available.`,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await executeSwap(fromSymbol, toSymbol, parsedFrom, slippage);
      showToast({
        type: "success",
        title: "Swap Executed",
        description: `Swapped ${parsedFrom} ${fromSymbol} for ${res.toAmount} ${toSymbol}`,
        txId: res.txId,
      });
      setFromAmount("");
    } catch {
      showToast({
        type: "error",
        title: "Swap Failed",
        description: "Transaction failed on Solana Devnet router.",
      });
    } finally {
      setLoading(false);
    }
  };

  const minReceived = (quote.toAmount * (1 - slippage / 100)).toFixed(4);

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6 animate-in fade-in duration-200">
      <div className="text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D221C]">
          Token Swap
        </h1>
        <p className="text-xs text-[#6C7065] mt-1">
          Instant deep-liquidity swaps across Solana Devnet with minimal slippage
        </p>
      </div>

      {/* Main Swap Card */}
      <div className="p-6 sm:p-7 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs backyard-card-bg relative">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E4D9]">
          <span className="font-serif text-lg font-medium text-[#1D221C]">
            Instant Swap
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border border-[#DDDBCF] transition-colors ${
              showSettings ? "bg-[#DFEAD7] text-[#274C20]" : "bg-[#EBE9DF]/70 text-[#6C7065] hover:text-[#1D221C]"
            }`}
            title="Slippage Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Slippage Settings Panel */}
        {showSettings && (
          <div className="my-4 p-4 rounded-2xl bg-[#EBE9DF]/70 border border-[#DDDBCF] space-y-2 animate-in fade-in">
            <span className="text-xs font-semibold text-[#1D221C] block">
              Slippage Tolerance
            </span>
            <div className="flex items-center gap-2">
              {[0.1, 0.5, 1.0].map((val) => (
                <button
                  key={val}
                  onClick={() => setSlippage(val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    slippage === val
                      ? "bg-[#2E5627] text-white border-[#2E5627]"
                      : "bg-[#F8F7F3] text-[#1D221C] border-[#DDDBCF] hover:bg-[#DDDBCF]"
                  }`}
                >
                  {val}%
                </button>
              ))}
              <div className="flex items-center px-2 py-1.5 rounded-xl bg-[#F8F7F3] border border-[#DDDBCF] text-xs font-mono">
                <input
                  type="number"
                  step="0.1"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                  className="w-12 bg-transparent outline-none text-right font-medium"
                />
                <span className="ml-1 text-[#6C7065]">%</span>
              </div>
            </div>
          </div>
        )}

        {/* From Box */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6C7065]">
            <span>You Pay</span>
            <span>
              Bal:{" "}
              <strong className="text-[#1D221C] font-mono">
                {fromToken.balance.toLocaleString()} {fromToken.symbol}
              </strong>
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EBE9DF]/70 border border-[#DDDBCF] focus-within:border-[#2E5627] transition-colors">
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-2xl font-mono font-medium text-[#1D221C] outline-none w-full"
            />
            {/* Token Selector */}
            <div className="relative shrink-0">
              <select
                value={fromSymbol}
                onChange={(e) => setFromSymbol(e.target.value)}
                className="appearance-none pl-8 pr-7 py-2 rounded-xl bg-[#F8F7F3] border border-[#DDDBCF] text-xs font-bold text-[#1D221C] outline-none cursor-pointer hover:bg-[#EBE9DF] transition-colors"
              >
                {tokens.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
              <img
                src={fromToken.icon}
                alt=""
                className="w-4 h-4 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#6C7065] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 justify-end">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                onClick={() => handleQuickPercent(pct)}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#EBE9DF]/60 hover:bg-[#EBE9DF] border border-[#DDDBCF] text-[#6C7065] hover:text-[#1D221C] transition-colors"
              >
                {pct === 1.0 ? "MAX" : `${pct * 100}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Flip Button */}
        <div className="my-2 flex justify-center relative z-10">
          <button
            onClick={handleFlip}
            className="p-2.5 rounded-full bg-[#F8F7F3] border border-[#DDDBCF] text-[#1D221C] hover:bg-[#EBE9DF] hover:rotate-180 transition-all shadow-xs"
            title="Switch Tokens"
          >
            <ArrowDownUp className="w-4 h-4 text-[#2E5627]" />
          </button>
        </div>

        {/* To Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6C7065]">
            <span>You Receive</span>
            <span>
              Bal:{" "}
              <strong className="text-[#1D221C] font-mono">
                {toToken.balance.toLocaleString()} {toToken.symbol}
              </strong>
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EBE9DF]/70 border border-[#DDDBCF]">
            <input
              type="text"
              readOnly
              placeholder="0.0"
              value={quote.toAmount > 0 ? quote.toAmount : ""}
              className="bg-transparent text-2xl font-mono font-medium text-[#1D221C] outline-none w-full"
            />
            {/* Token Selector */}
            <div className="relative shrink-0">
              <select
                value={toSymbol}
                onChange={(e) => setToSymbol(e.target.value)}
                className="appearance-none pl-8 pr-7 py-2 rounded-xl bg-[#F8F7F3] border border-[#DDDBCF] text-xs font-bold text-[#1D221C] outline-none cursor-pointer hover:bg-[#EBE9DF] transition-colors"
              >
                {tokens.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
              <img
                src={toToken.icon}
                alt=""
                className="w-4 h-4 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#6C7065] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="mt-5 p-4 rounded-2xl bg-[#EBE9DF]/40 border border-[#DDDBCF] text-xs space-y-2">
          <div className="flex justify-between text-[#6C7065]">
            <span>Exchange Rate</span>
            <span className="font-mono text-[#1D221C]">
              1 {fromSymbol} ≈ {(fromToken.price / toToken.price).toFixed(4)} {toSymbol}
            </span>
          </div>
          <div className="flex justify-between text-[#6C7065]">
            <span>Routing</span>
            <span className="text-[#2E5627] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Nexus Smart Router (Jupiter Devnet)
            </span>
          </div>
          <div className="flex justify-between text-[#6C7065]">
            <span>Minimum Received</span>
            <span className="font-mono text-[#1D221C]">
              {minReceived} {toSymbol}
            </span>
          </div>
          <div className="flex justify-between text-[#6C7065]">
            <span>Network Fee</span>
            <span className="font-mono text-[#1D221C]">~0.000005 SOL</span>
          </div>
        </div>

        {/* Submit Swap */}
        <button
          onClick={handleSwap}
          disabled={loading || parsedFrom <= 0}
          className="w-full mt-5 py-3.5 px-4 rounded-xl bg-[#2E5627] hover:bg-[#23461D] disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Routing swap on Solana Devnet...</span>
            </>
          ) : parsedFrom <= 0 ? (
            <span>Enter an amount</span>
          ) : (
            <span>Swap {fromSymbol} for {toSymbol}</span>
          )}
        </button>
      </div>
    </div>
  );
}
