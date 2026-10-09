"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useMemo, useState, useEffect, useCallback } from "react";
import { IDL, PROGRAM_ID } from "@/idl/nexus_vault";

export function useNexusPlatform() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [userData, setUserData] = useState<{ deposited: number; borrowed: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const programId = useMemo(() => new PublicKey(PROGRAM_ID), []);

  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
      return null;
    }
    const anchorProvider = new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    setProvider(anchorProvider);
    return anchorProvider;
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    // With idl.address correctly set, new Program(IDL, provider) works perfectly.
    return new Program(IDL as any, provider);
  }, [provider]);

  const getUserAccountAddress = useCallback(() => {
    if (!wallet.publicKey) return null;
    return PublicKey.findProgramAddressSync(
      [Buffer.from("user"), wallet.publicKey.toBuffer()],
      programId
    )[0];
  }, [wallet.publicKey, programId]);

 const getVaultAccountAddress = useCallback(() => {
  if (!wallet.publicKey) return null;

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      wallet.publicKey.toBuffer(),
    ],
    programId
  )[0];
}, [wallet.publicKey, programId]);

const refreshUserData = useCallback(async () => {
  if (!program || !wallet.publicKey) return;

  const vaultAccount = getVaultAccountAddress();
  if (!vaultAccount) return;

  try {
    setLoading(true);

    const accountsObj = program.account as any;
    const account = await accountsObj.vaultState.fetch(vaultAccount);

    setUserData({
      deposited: Number(account.totalDeposited.toString()) / LAMPORTS_PER_SOL,
      borrowed: 0,
    });
  } catch (error) {
    console.log("Vault not initialized yet.");
    setUserData(null);
  } finally {
    setLoading(false);
  }
}, [program, wallet.publicKey, getVaultAccountAddress]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const initializeUser = async () => {
  if (!program || !wallet.publicKey) {
    throw new Error("Please connect your wallet first.");
  }

  try {
    setLoading(true);

    const vaultAccount = getVaultAccountAddress();

    if (!vaultAccount) {
      throw new Error("Could not derive vault address.");
    }

    const tx = await (program.methods as any)
      .initializeVault("Nexus Vault")
      .accounts({
        vault: vaultAccount,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Vault initialized!", tx);
    alert(`Vault initialized successfully!\nTransaction: ${tx}`);
  } catch (error) {
    console.error("Vault initialization failed:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  const depositSol = async (amountInSol: number) => {
    if (!program || !wallet.publicKey) throw new Error("Wallet not connected");
    const userAccount = getUserAccountAddress();
    const vaultAccount = getVaultAccountAddress();
    if (!userAccount) return;

    const lamports = new BN(amountInSol * LAMPORTS_PER_SOL);

    try {
      setLoading(true);
      const methods = program.methods as any;
      const tx = await methods
        .depositSol(lamports)
        .accounts({
          userAccount: userAccount,
          vaultAccount: vaultAccount,
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log("Deposited SOL!", tx);
      await refreshUserData();
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    loading,
    isConnected: !!wallet.publicKey,
    initializeUser,
    depositSol,
    refreshUserData
  };
}
