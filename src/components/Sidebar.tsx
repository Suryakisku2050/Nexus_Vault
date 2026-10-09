"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Briefcase, 
  PiggyBank 
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Vaults", href: "/vaults", icon: PiggyBank },
  { label: "Borrow", href: "/borrow", icon: Wallet },
  { label: "Swap", href: "/swap", icon: ArrowRightLeft },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] h-screen flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          N
        </div>
        <span className="font-bold text-xl tracking-wide">Nexus Vault</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium" 
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="panel p-4 flex flex-col gap-2">
          <span className="text-sm font-semibold">Nexus Node Status</span>
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            Operational
          </div>
        </div>
      </div>
    </aside>
  );
}
