"use client";

import Link from "next/link";
import { Check, Clock, Sparkles, XCircle } from "lucide-react";

import { usePremium } from "@/components/premium-provider";
import type { Locale } from "@/lib/types";

const STRIPE_CHECKOUT_URL =
  "https://buy.stripe.com/3cIcN693jd8AgCN2g15EY0f?client_reference_id=agentspace-ws-w67miwye";

export function PricingActions({ locale }: { locale: Locale }) {
  const { hasPremium, email, latestOrder, isLoading, signOut } = usePremium();
  const zh = locale === "zh";

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

      <Link
        href={`/pricing/claim?lang=${locale}`}
        className="neo-button-secondary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm"
      >
        <Check className="h-4 w-4" />
        <span>{zh ? "我已付款，去登记订单" : "I paid — register my receipt"}</span>
      </Link>

      {!isLoading && email ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--line)] bg-white/3 p-4 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--text-soft)]">
              {zh ? "当前登记邮箱" : "Registered email"}
            </span>
            <span className="font-medium text-[var(--text)]">{email}</span>
          </div>
          <div className="flex items-center gap-2">
            {hasPremium ? (
              <>
                <Check className="h-4 w-4 text-[var(--gold)]" />
                <span className="text-[var(--gold)]">
                  {zh ? "会员已激活" : "Premium active"}
                </span>
              </>
            ) : latestOrder?.status === "pending" ? (
              <>
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400">
                  {zh
                    ? "订单审核中（通常 24 小时内处理）"
                    : "Order pending review (usually within 24h)"}
                </span>
              </>
            ) : latestOrder?.status === "rejected" ? (
              <>
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-400">
                  {zh
                    ? "订单未通过，请联系客服或重新提交"
                    : "Order rejected — contact support or resubmit"}
                </span>
              </>
            ) : (
              <span className="text-[var(--text-soft)]">
                {zh
                  ? "尚无订单，付款后请去登记"
                  : "No order yet — register your receipt after paying"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="self-start text-xs text-[var(--text-soft)] underline underline-offset-4 hover:text-[var(--text)]"
          >
            {zh ? "切换邮箱" : "Switch email"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
