import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { findLatestOrderByEmail, isEmailPremium } from "@/lib/server/store";

export async function GET() {
  const store = await cookies();
  const email = store.get("ns_email")?.value ?? "";
  if (!email) {
    return NextResponse.json({ email: null, hasPremium: false, latestOrder: null });
  }
  const hasPremium = await isEmailPremium(email);
  const latestOrder = await findLatestOrderByEmail(email);
  return NextResponse.json({ email, hasPremium, latestOrder });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("ns_email", "", { path: "/", maxAge: 0 });
  return response;
}
