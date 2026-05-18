import Link from "next/link";
import { Sparkles } from "lucide-react";
import { type ReactNode } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import { type Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  locale,
  className,
}: {
  children: ReactNode;
  locale: Locale;
  className?: string;
}) {
  const navItems = [
    { href: `/?lang=${locale}`, label: locale === "zh" ? "首页" : "Home" },
    { href: `/create?lang=${locale}`, label: locale === "zh" ? "创作" : "Create" },
    { href: `/pricing?lang=${locale}`, label: locale === "zh" ? "会员" : "Premium", featured: true },
    { href: `/pricing/claim?lang=${locale}`, label: locale === "zh" ? "订单" : "Orders" },
  ];

  return (
    <div className="min-h-screen text-[var(--text)]" data-locale={locale}>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1640px] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-40 mb-10">
          <div className="neo-surface rounded-[2.25rem] px-5 py-4 sm:px-6 lg:px-8 lg:py-5">
            <div className="grid items-center gap-5 xl:grid-cols-[minmax(280px,1fr)_minmax(520px,680px)_minmax(280px,1fr)]">
              <Link href={`/?lang=${locale}`} className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-[var(--line-strong)] bg-[radial-gradient(circle_at_30%_30%,rgba(247,224,184,0.42),rgba(122,91,42,0.12))] text-base font-semibold tracking-[0.28em] text-[var(--gold)] sm:h-[4.5rem] sm:w-[4.5rem]">
                  NS
                </div>
                <div className="min-w-0">
                  <div className="neo-display truncate text-3xl leading-none text-[var(--text)] sm:text-[2rem]">
                    Neo-Studio
                  </div>
                  <div className="mt-1.5 truncate text-xs uppercase tracking-[0.26em] text-[var(--text-soft)]">
                    {locale === "zh" ? "短剧 · 创作 · 会员" : "Drama · Create · Premium"}
                  </div>
                </div>
              </Link>

              <nav className="grid w-full grid-cols-4 gap-2 rounded-[1.75rem] border border-[var(--line)] bg-black/20 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-14 items-center justify-center rounded-[1.25rem] px-4 text-base font-semibold tracking-[0.02em] text-[var(--text-muted)] hover:bg-white/8 hover:text-[var(--text)] sm:min-h-16 sm:text-lg",
                      item.featured &&
                        "border border-[var(--line-strong)] bg-[var(--gold-soft)] text-[var(--gold)] shadow-[0_16px_36px_rgba(213,169,95,0.14)]",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center justify-start gap-3 xl:justify-end">
                <LanguageToggle locale={locale} />
                <Link
                  href={`/create?lang=${locale}`}
                  className="neo-button-primary inline-flex min-h-14 items-center gap-2 px-5 text-sm sm:px-7 sm:text-base"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{locale === "zh" ? "开始创作" : "Start creating"}</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className={cn("relative flex-1", className)}>{children}</main>
      </div>
    </div>
  );
}
