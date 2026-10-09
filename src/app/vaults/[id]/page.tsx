"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVaults } from "@/hooks/useNexusData";
import { useToast } from "@/components/ToastProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ArrowLeft,
  Coins,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Loader2,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function VaultDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { getVaultById, deposit, withdraw, claim } = useVaults();
  const { showToast } = useToast();
  const { connected } = useWallet();

  const vault = getVaultById(id);

  // Detail Page State
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "claim">("deposit");
  const [chartMetric, setChartMetric] = useState<"apy" | "tvl">("apy");
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "3M" | "ALL">("1W");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feesExpanded, setFeesExpanded] = useState<boolean>(false);

  const mockWalletBalance = 2450.5; // USDC mock wallet balance

  const parsedAmount = parseFloat(amount) || 0;

  // Chart data
  const chartData = useMemo(() => {
    if (!vault) return [];
    return vault.chartData.map((pt) => ({
      ...pt,
      displayVal: chartMetric === "apy" ? pt.apy : pt.tvl / 1000000,
    }));
  }, [vault, chartMetric]);

  const avgVal = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.displayVal, 0);
    return (sum / chartData.length).toFixed(2);
  }, [chartData]);

  if (!vault) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-serif text-3xl font-medium text-[#1D221C]">Vault Not Found</h2>
        <p className="text-[#6C7065] text-sm mt-2">The requested strategy vault could not be found.</p>
        <Link
          href="/vaults"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E5627] text-white text-sm font-medium hover:bg-[#23461D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vaults</span>
        </Link>
      </div>
    );
  }

  const handleQuickPercent = (pct: number) => {
    const base = activeTab === "deposit" ? mockWalletBalance : vault.userDeposit;
    setAmount((base * pct).toFixed(2));
  };

  const handleAction = async () => {
    if (activeTab === "claim") {
      setLoading(true);
      try {
        const res = await claim(vault.id);
        showToast({
          type: "success",
          title: "Rewards Claimed",
          description: `Successfully claimed ${vault.userEarnings.toFixed(2)} ${vault.assetSymbol}`,
          txId: res.txId,
        });
      } catch {
        showToast({
          type: "error",
          title: "Claim Failed",
          description: "Transaction failed on Solana Devnet.",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (parsedAmount <= 0) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        description: "Please enter an amount greater than 0.",
      });
      return;
    }

    if (activeTab === "withdraw" && parsedAmount > vault.userDeposit) {
      showToast({
        type: "error",
        title: "Insufficient Deposited Balance",
        description: `You only have ${vault.userDeposit.toLocaleString()} ${vault.assetSymbol} deposited.`,
      });
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "deposit") {
        const res = await deposit(vault.id, parsedAmount);
        showToast({
          type: "success",
          title: "Deposit Confirmed",
          description: `Successfully deposited ${parsedAmount.toLocaleString()} ${vault.assetSymbol} into ${vault.name}`,
          txId: res.txId,
        });
      } else {
        const res = await withdraw(vault.id, parsedAmount);
        showToast({
          type: "success",
          title: "Withdrawal Confirmed",
          description: `Successfully withdrew ${parsedAmount.toLocaleString()} ${vault.assetSymbol}`,
          txId: res.txId,
        });
      }
      setAmount("");
    } catch {
      showToast({
        type: "error",
        title: "Transaction Failed",
        description: "Could not execute action on Solana Devnet.",
      });
    } finally {
      setLoading(false);
    }
  };

  const estAnnualReturn = (parsedAmount * (vault.apy / 100)).toFixed(2);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Back */}
      <Link
        href="/vaults"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#6C7065] hover:text-[#1D221C] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all vaults</span>
      </Link>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs backyard-card-bg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={vault.assetIcon}
                  alt={vault.assetSymbol}
                  className="w-12 h-12 rounded-full border border-[#DDDBCF] shadow-xs"
                />
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D221C]">
                    {vault.name}
                  </h1>
                </div>
              </div>

              {/* Protocol & Contracts badges */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBE9DF] border border-[#DDDBCF] text-xs font-medium text-[#1D221C]">
                  <span>{vault.protocolIcon}</span>
                  <span>{vault.protocol}</span>
                </span>
                <a
                  href={`https://explorer.solana.com/address/${vault.address}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBE9DF] border border-[#DDDBCF] text-xs font-medium text-[#1D221C] hover:bg-[#DDDBCF] transition-colors"
                >
                  <span>Contracts</span>
                  <ExternalLink className="w-3 h-3 text-[#6C7065]" />
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm text-[#6C7065] leading-relaxed font-sans">
              {vault.description}
            </p>

            {/* Metrics Row */}
            <div className="mt-6 pt-6 border-t border-[#E6E4D9] grid grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#94998E] block">
                  TVL
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono text-xl sm:text-2xl font-medium text-[#1D221C]">
                    ${vault.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <Coins className="w-4 h-4 text-[#94998E]" />
                </div>
                <span className="text-[11px] text-[#94998E] font-mono block mt-0.5">
                  Underlying: ${(vault.underlyingTvl / 1000000).toFixed(2)}M
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#94998E] block">
                  My Position
                </span>
                <div className="font-mono text-xl sm:text-2xl font-medium text-[#1D221C] mt-1">
                  {vault.userDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })} {vault.assetSymbol}
                </div>
                <span className="text-[11px] text-[#94998E] font-mono block mt-0.5">
                  Earnings: +${vault.userEarnings.toFixed(2)}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#94998E] block">
                  APY
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono text-xl sm:text-2xl font-semibold text-[#1D221C]">
                    {vault.apy.toFixed(2)}%
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#DFEAD7] text-[#274C20] flex items-center justify-center text-xs font-bold">
                    +
                  </span>
                </div>
                <span className="text-[11px] text-[#2E8B3A] font-medium block mt-0.5">
                  Historical High
                </span>
              </div>
            </div>
          </div>

          {/* 2. Interactive Chart Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
            {/* Chart Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4D9]">
              <div className="flex items-center gap-6">
                <button className="font-serif text-lg font-medium text-[#1D221C] border-b-2 border-[#1D221C] pb-1">
                  Overview
                </button>
                <button className="font-serif text-lg font-medium text-[#94998E] hover:text-[#1D221C] pb-1 transition-colors">
                  Your position
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Metric Pill switch */}
                <div className="flex items-center p-1 rounded-xl bg-[#EBE9DF]/70 border border-[#DDDBCF] text-xs">
                  <button
                    onClick={() => setChartMetric("apy")}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      chartMetric === "apy"
                        ? "bg-[#F8F7F3] text-[#274C20] font-semibold shadow-2xs"
                        : "text-[#6C7065] hover:text-[#1D221C]"
                    }`}
                  >
                    ✦ APY
                  </button>
                  <button
                    onClick={() => setChartMetric("tvl")}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      chartMetric === "tvl"
                        ? "bg-[#F8F7F3] text-[#274C20] font-semibold shadow-2xs"
                        : "text-[#6C7065] hover:text-[#1D221C]"
                    }`}
                  >
                    TVL
                  </button>
                </div>

                {/* Timeframe switch */}
                <div className="flex items-center gap-1 text-xs font-medium text-[#6C7065]">
                  {(["1W", "1M", "3M", "ALL"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        timeframe === tf
                          ? "underline font-semibold text-[#1D221C]"
                          : "hover:text-[#1D221C]"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Big Metric Display */}
            <div className="mt-5 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-3xl sm:text-4xl font-medium text-[#1D221C]">
                  {chartMetric === "apy" ? `${vault.apy.toFixed(2)}%` : `$${(vault.tvl / 1000000).toFixed(2)}M`}
                </span>
                <span className="text-xs text-[#94998E] block mt-0.5">
                  {chartMetric === "apy" ? "Current Annual Percentage Yield" : "Current Total Value Locked"}
                </span>
              </div>
              <div className="text-right text-xs font-mono text-[#6C7065]">
                <span className="px-2 py-1 rounded-md bg-[#EBE9DF] border border-[#DDDBCF]">
                  Avg {avgVal}{chartMetric === "apy" ? "%" : "M"}
                </span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E5627" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2E5627" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#94998E"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94998E"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                    tickFormatter={(val) => (chartMetric === "apy" ? `${val}%` : `$${val}M`)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F8F7F3",
                      borderColor: "#DDDBCF",
                      borderRadius: "1rem",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                    }}
                    formatter={(val: any) => [
                      chartMetric === "apy" ? `${val}%` : `$${val}M`,
                      chartMetric === "apy" ? "APY" : "TVL",
                    ]}
                  />
                  <ReferenceLine
                    y={Number(avgVal)}
                    stroke="#94998E"
                    strokeDasharray="3 3"
                    label={{
                      value: `Avg ${avgVal}`,
                      fill: "#6C7065",
                      fontSize: 10,
                      position: "right",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="displayVal"
                    stroke="#2E5627"
                    strokeWidth={2.2}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Strategy Allocation Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
            <h3 className="font-serif text-2xl font-normal text-[#1D221C]">
              Strategy Allocation
            </h3>
            <p className="text-xs text-[#6C7065] mt-1">
              Automated smart router capital deployment across audited protocols
            </p>

            {/* Segment Progress Bar */}
            <div className="mt-5 h-4 w-full rounded-full bg-[#EBE9DF] overflow-hidden flex">
              {vault.allocation.map((item, i) => (
                <div
                  key={item.name}
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                  }}
                  className="h-full border-r border-[#F8F7F3] last:border-r-0 transition-all"
                  title={`${item.name}: ${item.percent}%`}
                />
              ))}
            </div>

            {/* Breakdown Items List */}
            <div className="mt-5 divide-y divide-[#E6E4D9]">
              {vault.allocation.map((item) => (
                <div key={item.name} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-[#1D221C]">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-[#1D221C]">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) - Action Panel */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs">
            {/* Tabs: Deposit | Withdraw | Claim in Serif Underlined */}
            <div className="flex items-center gap-6 border-b border-[#E6E4D9] pb-3">
              {(["deposit", "withdraw", "claim"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTab(t);
                    setAmount("");
                  }}
                  className={`font-serif text-xl capitalize transition-all pb-1 relative ${
                    activeTab === t
                      ? "text-[#1D221C] font-semibold border-b-2 border-[#1D221C]"
                      : "text-[#94998E] hover:text-[#1D221C]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Action Content */}
            <div className="mt-6 space-y-4">
              {activeTab === "claim" ? (
                /* Claim Screen */
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#DFEAD7] text-[#274C20] mx-auto flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-[#6C7065] block">Unclaimed Yield</span>
                  <div className="font-mono text-3xl font-medium text-[#2E8B3A]">
                    +${vault.userEarnings.toFixed(2)} {vault.assetSymbol}
                  </div>
                  <p className="text-xs text-[#6C7065] max-w-xs mx-auto">
                    Claim accrued yields directly into your connected Solana wallet.
                  </p>
                </div>
              ) : (
                /* Deposit / Withdraw Form */
                <>
                  <div className="flex items-center justify-between text-xs text-[#6C7065]">
                    <span>{activeTab === "deposit" ? "Deposit amount" : "Withdraw amount"}</span>
                    <span>
                      Bal:{" "}
                      <strong className="text-[#1D221C] font-mono">
                        {activeTab === "deposit"
                          ? `${mockWalletBalance.toLocaleString()} ${vault.assetSymbol}`
                          : `${vault.userDeposit.toLocaleString()} ${vault.assetSymbol}`}
                      </strong>
                    </span>
                  </div>

                  {/* Big Input */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EBE9DF]/70 border border-[#DDDBCF] focus-within:border-[#2E5627] transition-colors">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent text-2xl font-mono font-medium text-[#1D221C] outline-none w-full placeholder:text-[#94998E]"
                    />
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F3] border border-[#DDDBCF] text-xs font-semibold text-[#1D221C] shrink-0">
                      <img src={vault.assetIcon} alt="" className="w-4 h-4 rounded-full" />
                      {vault.assetSymbol}
                    </div>
                  </div>

                  {/* Percentage Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => handleQuickPercent(pct)}
                        className="py-1.5 text-xs font-medium rounded-lg bg-[#EBE9DF]/60 hover:bg-[#EBE9DF] border border-[#DDDBCF] text-[#1D221C] transition-colors"
                      >
                        {pct === 1.0 ? "100%" : `${pct * 100}%`}
                      </button>
                    ))}
                  </div>

                  {/* Summary Rows */}
                  <div className="pt-3 border-t border-[#E6E4D9] space-y-2 text-xs">
                    <div className="flex justify-between text-[#6C7065]">
                      <span>Total deposited</span>
                      <span className="font-mono text-[#1D221C] font-medium">
                        {vault.userDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                        {vault.assetSymbol}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#6C7065]">
                      <span>Est. Annual return</span>
                      <span className="font-mono text-[#2E8B3A] font-semibold">
                        +{estAnnualReturn} {vault.assetSymbol}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Main Submit Button */}
              <button
                onClick={handleAction}
                disabled={loading || (activeTab !== "claim" && parsedAmount <= 0)}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#2E5627] hover:bg-[#23461D] disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing on Solana Devnet...</span>
                  </>
                ) : (
                  <span>
                    {activeTab === "claim"
                      ? "Claim Rewards"
                      : activeTab === "deposit"
                      ? `Deposit ${vault.assetSymbol}`
                      : `Withdraw ${vault.assetSymbol}`}
                  </span>
                )}
              </button>

              {/* Expandable Fees & Slippage */}
              <div className="pt-2">
                <button
                  onClick={() => setFeesExpanded(!feesExpanded)}
                  className="w-full flex items-center justify-between text-xs text-[#6C7065] hover:text-[#1D221C] transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Fees + slippage
                    <Info className="w-3.5 h-3.5 text-[#94998E]" />
                  </span>
                  {feesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {feesExpanded && (
                  <div className="mt-3 p-3 rounded-xl bg-[#EBE9DF]/50 border border-[#DDDBCF] text-xs text-[#6C7065] space-y-1.5 animate-in fade-in">
                    <div className="flex justify-between">
                      <span>Deposit Fee:</span>
                      <span className="text-[#1D221C] font-mono">0.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Withdrawal Fee:</span>
                      <span className="text-[#1D221C] font-mono">0.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Slippage:</span>
                      <span className="text-[#1D221C] font-mono">0.10%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[#DDDBCF] bg-[#F8F7F3] shadow-xs space-y-3">
            <h4 className="font-serif text-2xl font-normal text-[#1D221C]">
              Additional Info
            </h4>

            <div className="divide-y divide-[#E6E4D9] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#6C7065]">Performance fee</span>
                <span className="font-mono text-[#1D221C] font-medium">{vault.performanceFee}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#6C7065]">Cooldown period</span>
                <span className="font-mono text-[#1D221C] font-medium">{vault.cooldown}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#6C7065]">Curator</span>
                <span className="font-medium text-[#1D221C]">{vault.curator}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#6C7065]">Audit Status</span>
                <span className="font-medium text-[#2E8B3A] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  OtterSec Audited
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
