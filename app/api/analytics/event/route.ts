import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  analyticsEventSchema,
  sanitizeMetadata,
} from "@/lib/api/public-write";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid analytics payload" },
        { status: 400 }
      );
    }

    const { brand_id, event_type, product_id, metadata } = parsed.data;
    const supabase = createAdminClient();

    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("id, is_flagged")
      .eq("id", brand_id)
      .maybeSingle();

    if (brandError || !brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (brand.is_flagged) {
      return NextResponse.json({ error: "Brand unavailable" }, { status: 403 });
    }

    if (product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("id")
        .eq("id", product_id)
        .eq("brand_id", brand_id)
        .eq("is_active", true)
        .maybeSingle();

      if (!product) {
        return NextResponse.json({ error: "Invalid product" }, { status: 400 });
      }
    }

    const clientMeta = sanitizeMetadata(metadata);
    const { error: insertError } = await supabase.from("analytic_events").insert({
      brand_id,
      event_type,
      product_id: product_id ?? null,
      metadata: {
        ...clientMeta,
        url: typeof clientMeta.url === "string" ? clientMeta.url : "",
      },
    });

    if (insertError) {
      console.error("Analytics insert error:", insertError);
      return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics event API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
