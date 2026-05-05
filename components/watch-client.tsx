"use client";

import Link from "next/link";
import { Clock, Lock, PlayCircle, Sparkles } from "lucide-react";

import { usePremium } from "@/components/premium-provider";
import type { Locale } from "@/lib/types";

const STRIPE_CHECKOUT_URL =
  "https://buy.stripe.com/3cIcN693jd8AgCN2g15EY0f?client_reference_id=agentspace-ws-w67miwye";

export function WatchClient({
  locale,
  episode,
  isFree,
  videoUrl,
  posterUrl,
  title,
}: {
  locale: Locale;
  episode: number;
  isFree: boolean;
  videoUrl: string;
  posterUrl: string;
  title: string;
}) {
  const { hasPremium, latestOrder } = usePremium();
  const zh = locale === "zh";
  const unlocked = isFree || hasPremium;
  const isPending = !hasPremium && latestOrder?.status === "pending";

  if (unlocked) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60">
        {videoUrl ? (
          <video
            controls
            playsInline
            poster={posterUrl}
            className="aspect-video w-full bg-black"
          >
            <source src={videoUrl} />
          </video>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-black text-sm text-[var(--text-soft)]">
            {zh ? "本集视频即将上线" : "Episode video coming soon"}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="neo-surface relative overflow-hidden rounded-3xl">
      <div
        className="aspect-video w-full bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${posterUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
        {isPending ? (
          <Clock className="h-10 w-10 text-amber-400" />
        ) : (
          <Lock className="h-10 w-10 text-[var(--gold)]" />
        )}
        <div className="neo-display text-xl text-white sm:text-2xl">
          {isPending
            ? zh
              ? "订单审核中"
              : "Order under review"
            : zh
              ? `第 ${episode} 集需要会员解锁`
              : `Episode ${episode} requires Premium`}
        </div>
        <p className="max-w-md text-sm text-white/80">
          {isPending
            ? zh
              ? "你的付款订单已登记，我们会在 24 小时内核对。通过后这里会自动解锁。"
              : "Your payment claim is logged. We'll verify within 24 hours; this page unlocks automatically once approved."
            : zh
              ? "前 3 集免费观看，第 4 集起需要开通会员。付款后来 /pricing/claim 登记订单即可激活。"
              : "First 3 episodes are free. Pay via the Stripe link, then register your receipt to activate."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={STRIPE_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-button-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>{zh ? "立即前往支付" : "Pay on Matrix"}</span>
          </Link>
          <Link
            href={`/pricing/claim?lang=${locale}`}
            className="neo-button-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            <PlayCircle className="h-4 w-4" />
            <span>{zh ? "我已付款，去登记" : "I paid — register receipt"}</span>
          </Link>
        </div>
        <p className="text-xs text-white/60">
          {zh ? `正在预览：${title}` : `Previewing: ${title}`}
        </p>
      </div>
    </div>
  );
}
