"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

import { usePremium } from "@/components/premium-provider";
import type { Locale } from "@/lib/types";

const STRIPE_CHECKOUT_URL =
  "https://buy.stripe.com/3cIcN693jd8AgCN2g15EY0f?client_reference_id=agentspace-ws-w67miwye";

export function PricingActions({ locale }: { locale: Locale }) {
  const { hasPremium, grantPremium, revokePremium } = usePremium();
  const [justGranted, setJustGranted] = useState(false);
  const zh = locale === "zh";

  function handleConfirmPaid() {
    grantPremium();
    setJustGranted(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={STRIPE_CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="neo-button-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm"
      >
        <Sparkles className="h-4 w-4" />
        <span>{zh ? "前往 Matrix 官方支付" : "Continue to Matrix checkout"}</span>
      </Link>

      {hasPremium ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--gold)]/50 bg-[var(--gold-soft)]/30 p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-[var(--text)]">
            <Check className="h-4 w-4 text-[var(--gold)]" />
            <span>{zh ? "会员已激活，可观看全部剧集" : "Premium active — all episodes unlocked"}</span>
          </div>
          <button
            type="button"
            onClick={revokePremium}
            className="self-start text-xs text-[var(--text-soft)] underline underline-offset-4 hover:text-[var(--text)]"
          >
            {zh ? "取消演示会员" : "Reset demo premium"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConfirmPaid}
          className="neo-button-secondary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm"
        >
          <Check className="h-4 w-4" />
          <span>{zh ? "我已完成支付" : "I already paid"}</span>
        </button>
      )}

      {justGranted ? (
        <p className="text-center text-xs text-[var(--gold)]">
          {zh
            ? "已解锁，返回首页继续观看。后续会由 Matrix 客服核销后改为自动开通。"
            : "Unlocked. Return to the feed to continue watching. Matrix support will reconcile payments automatically in production."}
        </p>
      ) : null}
    </div>
  );
}
