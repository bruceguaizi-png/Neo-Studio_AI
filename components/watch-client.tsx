"use client";

import Link from "next/link";
import { Lock, PlayCircle, Sparkles } from "lucide-react";

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
  const { hasPremium } = usePremium();
  const zh = locale === "zh";
  const unlocked = isFree || hasPremium;

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
        <Lock className="h-10 w-10 text-[var(--gold)]" />
        <div className="neo-display text-xl text-white sm:text-2xl">
          {zh
            ? `第 ${episode} 集需要会员解锁`
            : `Episode ${episode} requires Premium`}
        </div>
        <p className="max-w-md text-sm text-white/80">
          {zh
            ? "前 3 集免费观看，第 4 集起需要开通会员。一次付费，全部解锁。"
            : "First 3 episodes are free. Unlock the rest with a Premium membership."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={STRIPE_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-button-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>{zh ? "立即开通会员" : "Unlock Premium"}</span>
          </Link>
          <Link
            href={`/pricing?lang=${locale}`}
            className="neo-button-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            <PlayCircle className="h-4 w-4" />
            <span>{zh ? "查看会员权益" : "See benefits"}</span>
          </Link>
        </div>
        <p className="text-xs text-white/60">
          {zh ? `正在预览：${title}` : `Previewing: ${title}`}
        </p>
      </div>
    </div>
  );
}
