"use client";

import { Activity, ShieldCheck, TrendingUp, Vault, Wallet } from "lucide-react";
import { useNexusPlatform } from "@/hooks/useNexusPlatform";

export default function Home() {
  const { isConnected, loading, userData, initializeUser, depositSol } = useNexusPlatform();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <span className="text-xs font-bold px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20 animate-pulse">
          REAL + DEMO
        </span>
      </div>

      {/* Stats Grid - DEMO DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-80">
        {[
          { label: "Total Value Locked (Demo)", value: "$12,450,000", change: "+5.2%", icon: Vault },
          { label: "Total Supplied (Demo)", value: "$8,200,000", change: "+2.1%", icon: TrendingUp },
          { label: "Total Borrowed (Demo)", value: "$4,100,000", change: "-1.4%", icon: Activity },
          { label: "Est. Network APY (Demo)", value: "8.4%", change: "+0.5%", icon: ShieldCheck },
        ].map((stat, i) => (
          <div key={i} className="panel p-5 space-y-3">
            <div className="flex justify-between items-center text-[var(--muted)]">
              <span className="text-sm font-medium">{stat.label}</span>
              <stat.icon size={18} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className={`text-sm ${stat.change.startsWith("+") ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
              {stat.change} this week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Real Vault Profile & Demo Health */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LIVE ON-CHAIN PANEL */}
          <div className="panel p-6 border-[var(--primary)]/40 shadow-[0_0_20px_rgba(139,92,246,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="text-[var(--primary)]" size={20} /> 
                Your Devnet Profile (LIVE)
              </h3>
              <span className="text-xs text-[var(--muted)]">Powered by Anchor</span>
            </div>

            {!isConnected ? (
              <div className="text-center p-6 border border-dashed border-[var(--border)] rounded-lg text-[var(--muted)]">
                Connect your Phantom wallet to view your real on-chain profile.
              </div>
            ) : loading ? (
              <div className="text-center p-6 border border-dashed border-[var(--border)] rounded-lg text-[var(--primary)] animate-pulse">
                Syncing with Solana Devnet...
              </div>
            ) : !userData ? (
              <div className="text-center p-6 border border-dashed border-[var(--border)] rounded-lg space-y-4">
                <p className="text-[var(--muted)]">No vault profile detected for this wallet.</p>
                <button 
                  onClick={() => initializeUser()}
                  className="px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-colors"
                >
                  Initialize Profile
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <div className="text-sm text-[var(--muted)] mb-1">Supplied Collateral</div>
                    <div className="text-2xl font-bold text-[var(--success)]">{userData.deposited} SOL</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <div className="text-sm text-[var(--muted)] mb-1">Borrowed Amount</div>
                    <div className="text-2xl font-bold text-[var(--danger)]">{userData.borrowed} SOL</div>
                  </div>
                </div>
                
                {/* Interaction */}
                <div className="flex gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--surface-hover)]">
                  <button 
                    onClick={() => depositSol(1)}
                    className="flex-1 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-colors"
                  >
                    Deposit 1 SOL
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-semibold mb-6 flex justify-between">
              Borrowing Health <span className="text-xs bg-[var(--background)] px-2 py-1 rounded text-[var(--muted)]">DEMO</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Health Factor</span>
                <span className="font-bold text-[var(--success)]">1.84 (Safe)</span>
              </div>
              <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--success)] w-[65%]" />
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
                <span>Liquidation at &lt; 1.0</span>
                <span>Max borrowing power used: 65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex justify-between">
            Recent Activity <span className="text-xs bg-[var(--background)] px-2 py-1 rounded text-[var(--muted)]">DEMO</span>
          </h3>
          <div className="space-y-4">
            {[
              { type: "Supply", asset: "15 SOL", time: "2 mins ago", status: "Success" },
              { type: "Borrow", asset: "500 USDC", time: "1 hour ago", status: "Success" },
              { type: "Repay", asset: "100 USDC", time: "3 hours ago", status: "Success" },
              { type: "Swap", asset: "10 SOL -> 1450 USDC", time: "1 day ago", status: "Success" },
            ].map((tx, i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Activity size={14} className="text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{tx.type}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{tx.asset}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--success)]">{tx.status}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-1">{tx.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
