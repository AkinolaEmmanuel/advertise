import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const RESERVED_SLUGS = [
  "admin", "login", "signup", "dashboard", "api", "auth", "settings",
  "products", "orders", "analytics", "preview", "explore", "brands",
  "renew", "legal", "terms", "privacy", "help", "support"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get("name");

  if (!brandName || brandName.length < 2) {
    return NextResponse.json({ available: false, error: "Too short" });
  }

  const slug = brandName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  if (RESERVED_SLUGS.includes(slug)) {
    return NextResponse.json({ available: false, error: "Reserved name" });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ available: false, error: "Check failed" }, { status: 500 });
  }

  return NextResponse.json({ available: !data, slug });
}
