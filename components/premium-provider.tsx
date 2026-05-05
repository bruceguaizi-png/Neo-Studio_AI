"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { PREMIUM_COOKIE_NAME, PREMIUM_STORAGE_KEY } from "@/lib/paywall";

type PremiumContextValue = {
  hasPremium: boolean;
  grantPremium: () => void;
  revokePremium: () => void;
};

const PremiumContext = createContext<PremiumContextValue | null>(null);

function writeCookie(value: "1" | "") {
  if (typeof document === "undefined") return;
  const maxAge = value === "1" ? 60 * 60 * 24 * 365 : 0;
  document.cookie = `${PREMIUM_COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    try {
      const fromStorage = window.localStorage.getItem(PREMIUM_STORAGE_KEY) === "1";
      const fromCookie = document.cookie
        .split(";")
        .some((part) => part.trim() === `${PREMIUM_COOKIE_NAME}=1`);
      setHasPremium(fromStorage || fromCookie);
    } catch {
      /* ignore */
    }
  }, []);

  const grantPremium = useCallback(() => {
    try {
      window.localStorage.setItem(PREMIUM_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    writeCookie("1");
    setHasPremium(true);
  }, []);

  const revokePremium = useCallback(() => {
    try {
      window.localStorage.removeItem(PREMIUM_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    writeCookie("");
    setHasPremium(false);
  }, []);

  return (
    <PremiumContext.Provider value={{ hasPremium, grantPremium, revokePremium }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) {
    throw new Error("usePremium must be used inside <PremiumProvider>");
  }
  return ctx;
}
