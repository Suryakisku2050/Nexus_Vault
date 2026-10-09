import { ClientWalletButton } from "@/components/ClientWalletButton";

export function Topbar() {
  return (
    <header className="h-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold hidden md:block">Dashboard</h1>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] text-xs font-bold border border-[var(--warning)]/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          DEVNET
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ClientWalletButton />
      </div>
    </header>
  );
}
