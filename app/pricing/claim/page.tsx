import { ClaimForm } from "@/components/claim-form";
import { SiteShell } from "@/components/site-shell";

export default async function ClaimPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = sp.lang === "zh" ? "zh" : "en";
  const zh = locale === "zh";

  return (
    <SiteShell locale={locale}>
      <section className="mx-auto flex max-w-xl flex-col gap-6 py-10">
        <div className="flex flex-col gap-2">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-soft)]">
            {zh ? "支付登记" : "Payment claim"}
          </div>
          <h1 className="neo-display text-2xl sm:text-3xl">
            {zh ? "登记你的 Stripe 订单" : "Register your Stripe receipt"}
          </h1>
          <p className="text-sm text-[var(--text-soft)]">
            {zh
              ? "在 Matrix Stripe 完成付款后，请在这里登记邮箱和 Stripe 收据编号。我们会在 24 小时内核对并开通会员。"
              : "After paying on the Matrix Stripe page, submit the email you used and the Stripe receipt reference. We will verify and activate your membership within 24 hours."}
          </p>
        </div>

        <ClaimForm locale={locale} />

        <div className="rounded-2xl border border-[var(--line)] bg-white/3 p-4 text-xs text-[var(--text-soft)]">
          {zh
            ? "提示：Stripe 收据编号可以在 Stripe 发给你邮箱的付款确认邮件中找到（通常以 pi_、ch_ 或 rcpt_ 开头）。"
            : "Tip: Your Stripe receipt reference appears in the email Stripe sends after a successful payment (usually starting with pi_, ch_, or rcpt_)."}
        </div>
      </section>
    </SiteShell>
  );
}
