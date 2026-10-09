"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, ExternalLink } from "lucide-react";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
  txId?: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, description, txId }: Omit<ToastItem, "id">) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, title, description, txId }]);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#F8F7F3] border border-[#DDDBCF] shadow-lg shadow-black/5 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-[#2E8B3A]" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-[#B9382F]" />
              )}
              {toast.type === "info" && <Info className="w-5 h-5 text-[#2E5627]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#1D221C]">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-[#6C7065] mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
              {toast.txId && (
                <a
                  href={`https://explorer.solana.com/tx/${toast.txId}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2E5627] hover:underline mt-1.5"
                >
                  View on Solana Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#94998E] hover:text-[#1D221C] p-1 rounded-lg hover:bg-[#EBE9DF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
