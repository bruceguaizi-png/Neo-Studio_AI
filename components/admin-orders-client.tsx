"use client";

import { useCallback, useEffect, useState } from "react";

import type { Locale, PremiumOrder } from "@/lib/types";

const TOKEN_STORAGE_KEY = "ns_admin_token";

export function AdminOrdersClient({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<PremiumOrder[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(
    async (nextToken: string, status: typeof filter) => {
      setError("");
      try {
        const url = status === "all" ? "/api/orders" : `/api/orders?status=${status}`;
        const res = await fetch(url, {
          headers: { "x-admin-token": nextToken },
          cache: "no-store",
        });
        if (res.status === 401) {
          setError(zh ? "ADMIN_TOKEN 错误" : "Invalid ADMIN_TOKEN");
          setAuthed(false);
          return;
        }
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as { orders: PremiumOrder[] };
        setOrders(data.orders);
        setAuthed(true);
      } catch {
        setError(zh ? "加载失败，请稍后重试" : "Failed to load orders");
      }
    },
    [zh],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
    if (saved) {
      setToken(saved);
      void load(saved, filter);
    }
  }, [filter, load]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    await load(token, filter);
  }

  function handleLogout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken("");
    setAuthed(false);
    setOrders([]);
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
      await load(token, filter);
    } catch {
      setError(zh ? "更新失败" : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  if (!authed) {
    return (
      <form
        onSubmit={handleLogin}
        className="neo-surface flex max-w-md flex-col gap-3 rounded-2xl p-6"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[var(--text-soft)]">ADMIN_TOKEN</span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
            autoFocus
          />
        </label>
        <button
          type="submit"
          className="neo-button-primary inline-flex items-center justify-center px-4 py-2 text-sm"
        >
          {zh ? "进入" : "Enter"}
        </button>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
                void load(token, key);
              }}
              className={
                filter === key
                  ? "neo-button-primary px-3 py-1.5 text-xs"
                  : "neo-button-secondary px-3 py-1.5 text-xs"
              }
            >
              {zh
                ? key === "pending"
                  ? "待审核"
                  : key === "approved"
                    ? "已通过"
                    : key === "rejected"
                      ? "已驳回"
                      : "全部"
                : key}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-[var(--text-soft)] underline underline-offset-4 hover:text-[var(--text)]"
        >
          {zh ? "退出" : "Log out"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex flex-col gap-3">
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--text-soft)]">
            {zh ? "暂无订单" : "No orders"}
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="neo-surface flex flex-col gap-2 rounded-2xl p-4 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-medium text-[var(--text)]">{order.email}</span>
                  <span className="text-xs text-[var(--text-soft)]">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <StatusBadge status={order.status} zh={zh} />
              </div>
              <div className="text-xs text-[var(--text-soft)]">
                {zh ? "订单号：" : "Receipt: "}
                <span className="font-mono text-[var(--text)]">{order.receipt}</span>
              </div>
              {order.note ? (
                <div className="text-xs text-[var(--text-soft)]">
                  {zh ? "备注：" : "Note: "}
                  {order.note}
                </div>
              ) : null}
              {order.status === "pending" ? (
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => void updateStatus(order.id, "approved")}
                    className="neo-button-primary px-3 py-1.5 text-xs disabled:opacity-60"
                  >
                    {zh ? "通过并开通会员" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => void updateStatus(order.id, "rejected")}
                    className="neo-button-secondary px-3 py-1.5 text-xs disabled:opacity-60"
                  >
                    {zh ? "驳回" : "Reject"}
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, zh }: { status: PremiumOrder["status"]; zh: boolean }) {
  const style =
    status === "approved"
      ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold)]"
      : status === "rejected"
        ? "border-red-500/50 bg-red-500/10 text-red-400"
        : "border-amber-500/40 bg-amber-500/10 text-amber-400";
  const label =
    status === "approved"
      ? zh
        ? "已通过"
        : "Approved"
      : status === "rejected"
        ? zh
          ? "已驳回"
          : "Rejected"
        : zh
          ? "待审核"
          : "Pending";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${style}`}>
      {label}
    </span>
  );
}
