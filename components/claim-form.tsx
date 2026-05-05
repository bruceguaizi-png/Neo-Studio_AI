"use client";

import Link from "next/link";
import { useState } from "react";

import type { Locale } from "@/lib/types";

export function ClaimForm({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@") || receipt.trim().length < 4) {
      setStatus("error");
      setMessage(zh ? "请填写有效邮箱和订单号" : "Valid email and receipt are required");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, receipt, note: note || undefined }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "submit failed");
      }
      setStatus("done");
      setMessage(
        zh
          ? "已收到你的订单。审核通过后会员会自动生效，请保持此邮箱登录状态。"
          : "We received your order. Your membership will be activated once the payment is verified.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        zh
          ? "提交失败，请稍后重试。"
          : `Submission failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
  }

  if (status === "done") {
    return (
      <div className="neo-surface flex flex-col gap-3 rounded-2xl p-6">
        <div className="neo-display text-lg">
          {zh ? "已登记成功 ✓" : "Submitted ✓"}
        </div>
        <p className="text-sm text-[var(--text-soft)]">{message}</p>
        <div className="flex gap-3">
          <Link
            href={`/?lang=${locale}`}
            className="neo-button-secondary inline-flex items-center px-4 py-2 text-sm"
          >
            {zh ? "返回首页" : "Back to feed"}
          </Link>
          <Link
            href={`/pricing?lang=${locale}`}
            className="neo-button-secondary inline-flex items-center px-4 py-2 text-sm"
          >
            {zh ? "查看会员状态" : "Check status"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="neo-surface flex flex-col gap-4 rounded-2xl p-6"
    >
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--text-soft)]">
          {zh ? "邮箱（用于识别会员）" : "Email (used to identify membership)"}
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--text-soft)]">
          {zh ? "Stripe 收据编号 / 订单号" : "Stripe receipt reference"}
        </span>
        <input
          type="text"
          required
          value={receipt}
          onChange={(e) => setReceipt(e.target.value)}
          placeholder="pi_... / ch_... / rcpt_..."
          className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--text-soft)]">
          {zh ? "备注（可选）" : "Note (optional)"}
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="neo-button-primary inline-flex items-center justify-center px-5 py-3 text-sm disabled:opacity-60"
      >
        {status === "submitting"
          ? zh
            ? "提交中..."
            : "Submitting..."
          : zh
            ? "提交登记"
            : "Submit claim"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-400">{message}</p>
      ) : null}
    </form>
  );
}
