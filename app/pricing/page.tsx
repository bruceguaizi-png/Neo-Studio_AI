import { Check } from "lucide-react";

import { PricingActions } from "@/components/pricing-actions";
import { SiteShell } from "@/components/site-shell";

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = params.lang === "zh" ? "zh" : "en";
  const zh = locale === "zh";

  const perks = zh
    ? [
        "无限解锁全部短剧剧集",
        "全新剧集优先上架",
        "4K 高清 + 免广告播放",
        "多端同步观看进度",
      ]
    : [
        "Unlock every drama episode",
        "Early access to new releases",
        "4K playback without ads",
        "Cross-device watch sync",
      ];

  return (
    <SiteShell locale={locale}>
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 py-12 text-center">
        <div className="flex flex-col gap-3">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-soft)]">
            {zh ? "会员订阅" : "Membership"}
          </div>
          <h1 className="neo-display text-3xl sm:text-4xl">
            {zh ? "解锁 Neo-Studio 全部短剧" : "Unlock every Neo-Studio drama"}
          </h1>
          <p className="text-sm text-[var(--text-soft)] sm:text-base">
            {zh
              ? "由 Matrix 官方 Stripe 安全收单，支付完成后由工作空间所有者联系 Matrix 官方客服核销。"
              : "Checkout is hosted by Matrix via Stripe. After payment, the workspace owner contacts Matrix support to reconcile funds."}
          </p>
        </div>

        <div className="neo-surface w-full rounded-3xl p-8 text-left">
          <div className="flex items-baseline justify-between gap-4">
            <div className="neo-display text-2xl">
              {zh ? "会员订阅" : "Premium"}
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-soft)]">
                {zh ? "一键开通" : "One-click"}
              </div>
            </div>
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 text-[var(--gold)]" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <PricingActions locale={locale} />
          </div>

          <p className="mt-4 text-center text-xs text-[var(--text-soft)]">
            {zh
              ? "支付由 Matrix 官方托管的 Stripe 链接处理，您的订单会自动归属此工作空间。"
              : "Payment is handled by a Matrix-hosted Stripe link; your order is automatically linked to this workspace."}
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
