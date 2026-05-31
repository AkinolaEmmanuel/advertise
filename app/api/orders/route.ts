import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrderSchema } from "@/lib/api/public-write";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order payload" },
        { status: 400 }
      );
    }

    const { brand_id, customer_name, customer_phone, total_amount, items } =
      parsed.data;

    const computedTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(computedTotal - total_amount) > 1) {
      return NextResponse.json(
        { error: "Order total does not match line items" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("id, is_flagged")
      .eq("id", brand_id)
      .maybeSingle();

    if (brandError || !brand) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (brand.is_flagged) {
      return NextResponse.json({ error: "Store unavailable" }, { status: 403 });
    }

    const { error: insertError } = await supabase.from("orders").insert({
      brand_id,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone?.trim() || null,
      total_amount,
      items,
      status: "pending",
    });

    if (insertError) {
      console.error("Order insert error:", insertError);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
