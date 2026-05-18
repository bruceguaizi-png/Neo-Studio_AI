import { AdminOrdersClient } from "@/components/admin-orders-client";
import { SiteShell } from "@/components/site-shell";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const locale = sp.lang === "zh" ? "zh" : "en";
  const zh = locale === "zh";

  return (
    <SiteShell locale={locale}>
      <section className="mx-auto flex max-w-4xl flex-col gap-6 py-10">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-soft)]">
            {zh ? "管理员" : "Admin"}
          </div>
          <h1 className="neo-display text-2xl sm:text-3xl">
            {zh ? "会员订单审核" : "Premium order review"}
          </h1>
          <p className="text-sm text-[var(--text-soft)]">
            {zh
              ? "输入 ADMIN_TOKEN 后可以看到所有付款登记。核对 Stripe 后台后点「通过」即可为该邮箱开通会员。"
              : "Enter the ADMIN_TOKEN to see all payment claims. Verify against Stripe, then approve to activate the customer's membership."}
          </p>
        </div>

        <AdminOrdersClient locale={locale} />
      </section>
    </SiteShell>
  );
}
