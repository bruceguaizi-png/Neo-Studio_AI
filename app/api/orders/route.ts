import { NextResponse } from "next/server";

import { createPremiumOrder, listPremiumOrders } from "@/lib/server/store";

const ADMIN_HEADER = "x-admin-token";

function isAdmin(request: Request) {
  const token = request.headers.get(ADMIN_HEADER);
  const expected = process.env.ADMIN_TOKEN;
  return Boolean(token && expected && token === expected);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.receipt !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing email or receipt" },
      { status: 400 },
    );
  }
  if (!body.email.includes("@") || body.receipt.trim().length < 4) {
    return NextResponse.json(
      { error: "Invalid email or receipt" },
      { status: 400 },
    );
  }
  const order = await createPremiumOrder({
    email: body.email,
    receipt: body.receipt,
    note: typeof body.note === "string" ? body.note : undefined,
  });
  const response = NextResponse.json({ order });
  response.cookies.set("ns_email", order.email, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const orders = await listPremiumOrders(
    status === "pending" || status === "approved" || status === "rejected"
      ? status
      : undefined,
  );
  return NextResponse.json({ orders });
}
