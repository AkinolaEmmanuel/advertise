import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (brandError || !brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  const { data: events, error } = await supabase
    .from("analytic_events")
    .select("event_type, created_at")
    .eq("brand_id", brand.id)
    .gt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const visits = events.filter((e) => e.event_type === "page_view").length;
  const whatsappClicks = events.filter((e) => e.event_type === "whatsapp_click").length;
  const transferClicks = events.filter((e) => e.event_type === "transfer_click").length;

  const conversionRate =
    visits > 0 ? ((whatsappClicks / visits) * 100).toFixed(1) : "0";

  const dailyVisits = events
    .filter((e) => e.event_type === "page_view")
    .reduce<Record<string, number>>((acc, e) => {
      const date = new Date(e.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  return NextResponse.json({
    totalVisits: visits,
    whatsappClicks,
    transferClicks,
    conversionRate,
    dailyVisits,
  });
}
