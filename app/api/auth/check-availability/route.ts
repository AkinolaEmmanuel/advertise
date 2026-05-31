import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSlug, isReservedSlug } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get("name");

  if (!brandName || brandName.length < 2) {
    return NextResponse.json({ available: false, error: "Too short" });
  }

  const slug = generateSlug(brandName);

  if (!slug) {
    return NextResponse.json({ available: false, error: "Invalid name" });
  }

  if (isReservedSlug(slug)) {
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
