import Link from "next/link";
import { notFound } from "next/navigation";

import { WatchClient } from "@/components/watch-client";
import { SiteShell } from "@/components/site-shell";
import { getFeedVideos } from "@/lib/server/store";
import { FREE_EPISODES, episodeNumberOf } from "@/lib/paywall";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const locale = sp.lang === "zh" ? "zh" : "en";
  const zh = locale === "zh";

  const videos = await getFeedVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) notFound();
  const video = videos[index];
  const episode = episodeNumberOf(index);
  const isFree = index < FREE_EPISODES;

  return (
    <SiteShell locale={locale}>
      <section className="mx-auto flex max-w-4xl flex-col gap-4 py-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-soft)]">
          <Link href={`/?lang=${locale}`} className="hover:text-[var(--text)]">
            {zh ? "← 返回首页" : "← Back to feed"}
          </Link>
          <span className="text-[var(--text-soft)]">·</span>
          <span className="neo-display text-lg text-[var(--text)]">
            {zh ? `第 ${episode} 集` : `Episode ${episode}`}
          </span>
          {isFree ? (
            <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
              {zh ? "免费" : "Free"}
            </span>
          ) : (
            <span className="rounded-full border border-[var(--gold)] bg-[var(--gold-soft)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]">
              {zh ? "会员" : "Premium"}
            </span>
          )}
        </div>

        <h1 className="neo-display text-2xl sm:text-3xl">{video.title[locale]}</h1>
        <p className="text-sm text-[var(--text-soft)]">{video.summary[locale]}</p>

        <WatchClient
          locale={locale}
          episode={episode}
          isFree={isFree}
          videoUrl={video.videoUrl}
          posterUrl={video.posterUrl}
          title={video.title[locale]}
        />
      </section>
    </SiteShell>
  );
}
