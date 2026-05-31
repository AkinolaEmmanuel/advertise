import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndNotifyExpiry } from "@/lib/subscriptions";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await checkAndNotifyExpiry(user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
