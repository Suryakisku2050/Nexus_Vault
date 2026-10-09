"use client";

import { useState, useCallback, useMemo } from "react";
import {
  MOCK_VAULTS,
  MOCK_SUPPLY_MARKETS,
  MOCK_BORROW_MARKETS,
  MOCK_TOKENS,
  Vault,
  SupplyMarket,
  BorrowMarket,
  TokenInfo,
} from "@/lib/mock-data";

export function useVaults() {
  const [vaults, setVaults] = useState<Vault[]>(MOCK_VAULTS);
  const [search, setSearch] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"tvl" | "apy">("tvl");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Summary stats
  const stats = useMemo(() => {
    const totalTvl = vaults.reduce((acc, v) => acc + v.tvl, 0);
    const userDeposits = vaults.reduce((acc, v) => acc + v.userDeposit, 0);
    const userEarnings = vaults.reduce((acc, v) => acc + v.userEarnings, 0);
    return {
      totalTvl,
      userDeposits,
      userEarnings,
    };
  }, [vaults]);

  // Protocols & assets available for filters
  const protocols = useMemo(() => {
    return Array.from(new Set(vaults.map((v) => v.protocol)));
  }, [vaults]);

  const assets = useMemo(() => {
    return Array.from(new Set(vaults.map((v) => v.assetSymbol)));
  }, [vaults]);

  // Filtered and sorted vaults
  const filteredVaults = useMemo(() => {
    return vaults
      .filter((v) => {
        const matchesSearch =
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.assetSymbol.toLowerCase().includes(search.toLowerCase()) ||
          v.protocol.toLowerCase().includes(search.toLowerCase());
        const matchesProtocol =
          selectedProtocol === "all" || v.protocol.toLowerCase() === selectedProtocol.toLowerCase();
        const matchesAsset =
          selectedAsset === "all" || v.assetSymbol.toLowerCase() === selectedAsset.toLowerCase();
        return matchesSearch && matchesProtocol && matchesAsset;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "desc" ? -1 : 1;
        if (sortBy === "apy") {
          return (a.apy - b.apy) * multiplier;
        }
        return (a.tvl - b.tvl) * multiplier;
      });
  }, [vaults, search, selectedProtocol, selectedAsset, sortBy, sortOrder]);

  const getVaultById = useCallback(
    (id: string) => {
      return vaults.find((v) => v.id === id) || null;
    },
    [vaults]
  );

  const deposit = useCallback(async (id: string, amount: number) => {
    await new Promise((res) => setTimeout(res, 1200));
    setVaults((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              userDeposit: v.userDeposit + amount,
              tvl: v.tvl + amount,
            }
          : v
      )
    );
    return { success: true, txId: `tx_dep_${Date.now()}` };
  }, []);

  const withdraw = useCallback(async (id: string, amount: number) => {
    await new Promise((res) => setTimeout(res, 1200));
    setVaults((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              userDeposit: Math.max(0, v.userDeposit - amount),
              tvl: Math.max(0, v.tvl - amount),
            }
          : v
      )
    );
    return { success: true, txId: `tx_wth_${Date.now()}` };
  }, []);

  const claim = useCallback(async (id: string) => {
    await new Promise((res) => setTimeout(res, 1000));
    let claimed = 0;
    setVaults((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          claimed = v.userEarnings;
          return { ...v, userEarnings: 0 };
        }
        return v;
      })
    );
    return { success: true, claimed, txId: `tx_clm_${Date.now()}` };
  }, []);

  return {
    vaults: filteredVaults,
    allVaults: vaults,
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
    getVaultById,
    deposit,
    withdraw,
    claim,
  };
}

export function useLend() {
  const [supplyMarkets, setSupplyMarkets] = useState<SupplyMarket[]>(MOCK_SUPPLY_MARKETS);
  const [borrowMarkets, setBorrowMarkets] = useState<BorrowMarket[]>(MOCK_BORROW_MARKETS);

  // User summary
  const summary = useMemo(() => {
    // Standard price map: SOL = $184, USDC/USDG/PYUSD = $1.00
    const solPrice = 184.25;
    const suppliedUsd = supplyMarkets.reduce((acc, m) => {
      const p = m.symbol === "SOL" ? solPrice : 1.0;
      return acc + m.userSupplied * p;
    }, 0);

    const borrowedUsd = borrowMarkets.reduce((acc, m) => {
      const p = m.symbol === "SOL" ? solPrice : 1.0;
      return acc + m.userBorrowed * p;
    }, 0);

    const borrowLimit = suppliedUsd * 0.8; // 80% LTV average
    const borrowLimitUsed = borrowLimit > 0 ? (borrowedUsd / borrowLimit) * 100 : 0;
    const healthFactor =
      borrowedUsd > 0 ? (suppliedUsd * 0.85) / borrowedUsd : 999;

    return {
      suppliedUsd,
      borrowedUsd,
      borrowLimit,
      borrowLimitUsed,
      healthFactor,
      netApy: 4.85,
    };
  }, [supplyMarkets, borrowMarkets]);

  const supply = useCallback(async (symbol: string, amount: number) => {
    await new Promise((res) => setTimeout(res, 1200));
    setSupplyMarkets((prev) =>
      prev.map((m) =>
        m.symbol === symbol
          ? {
              ...m,
              userSupplied: m.userSupplied + amount,
              walletBalance: Math.max(0, m.walletBalance - amount),
              totalSupplied: m.totalSupplied + amount,
            }
          : m
      )
    );
    return { success: true, txId: `tx_sup_${Date.now()}` };
  }, []);

  const withdrawSupply = useCallback(async (symbol: string, amount: number) => {
    await new Promise((res) => setTimeout(res, 1200));
    setSupplyMarkets((prev) =>
      prev.map((m) =>
        m.symbol === symbol
          ? {
              ...m,
              userSupplied: Math.max(0, m.userSupplied - amount),
              walletBalance: m.walletBalance + amount,
              totalSupplied: Math.max(0, m.totalSupplied - amount),
            }
          : m
      )
    );
    return { success: true, txId: `tx_wth_sup_${Date.now()}` };
  }, []);

  const borrow = useCallback(async (symbol: string, amount: number) => {
    await new Promise((res) => setTimeout(res, 1200));
    setBorrowMarkets((prev) =>
      prev.map((m) =>
        m.symbol === symbol
          ? {
              ...m,
              userBorrowed: m.userBorrowed + amount,
              availableLiquidity: Math.max(0, m.availableLiquidity - amount),
              totalBorrowed: m.totalBorrowed + amount,
            }
          : m
      )
    );
    return { success: true, txId: `tx_bor_${Date.now()}` };
  }, []);

  const repay = useCallback(async (symbol: string, amount: number) => {
    await new Promise((res) => setTimeout(res, 1200));
    setBorrowMarkets((prev) =>
      prev.map((m) =>
        m.symbol === symbol
          ? {
              ...m,
              userBorrowed: Math.max(0, m.userBorrowed - amount),
              availableLiquidity: m.availableLiquidity + amount,
              totalBorrowed: Math.max(0, m.totalBorrowed - amount),
            }
          : m
      )
    );
    return { success: true, txId: `tx_rep_${Date.now()}` };
  }, []);

  return {
    supplyMarkets,
    borrowMarkets,
    summary,
    supply,
    withdrawSupply,
    borrow,
    repay,
  };
}

export function useSwap() {
  const [tokens, setTokens] = useState<TokenInfo[]>(MOCK_TOKENS);

  const getQuote = useCallback(
    (fromSymbol: string, toSymbol: string, amount: number) => {
      const fromTok = tokens.find((t) => t.symbol === fromSymbol) || tokens[0];
      const toTok = tokens.find((t) => t.symbol === toSymbol) || tokens[1];
      if (amount <= 0) return { toAmount: 0, rate: 0, priceImpact: 0 };

      const fromValue = amount * fromTok.price;
      const toAmount = fromValue / toTok.price;
      const rate = fromTok.price / toTok.price;
      const priceImpact = 0.05; // 0.05%

      return {
        toAmount: Number(toAmount.toFixed(4)),
        rate: Number(rate.toFixed(6)),
        priceImpact,
      };
    },
    [tokens]
  );

  const executeSwap = useCallback(
    async (fromSymbol: string, toSymbol: string, amount: number, slippage: number) => {
      await new Promise((res) => setTimeout(res, 1500));
      const { toAmount } = getQuote(fromSymbol, toSymbol, amount);

      setTokens((prev) =>
        prev.map((tok) => {
          if (tok.symbol === fromSymbol) {
            return { ...tok, balance: Math.max(0, tok.balance - amount) };
          }
          if (tok.symbol === toSymbol) {
            return { ...tok, balance: tok.balance + toAmount };
          }
          return tok;
        })
      );

      return {
        success: true,
        fromSymbol,
        toSymbol,
        fromAmount: amount,
        toAmount,
        txId: `tx_swp_${Date.now()}`,
      };
    },
    [getQuote]
  );

  return {
    tokens,
    getQuote,
    executeSwap,
  };
}
