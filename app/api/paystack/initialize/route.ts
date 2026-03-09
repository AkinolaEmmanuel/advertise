import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction, PLANS } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, type } = await request.json();

    if (type === "subscription") {
      const planConfig = PLANS[plan as keyof typeof PLANS];
      if (!planConfig) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const { data: brand } = await supabase
        .from("brands")
        .select("id, name")
        .eq("user_id", user.id)
        .single();

      if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
      }

      const reference = `sub_${brand.id}_${Date.now()}`;
      const result = await initializeTransaction({
        email: user.email!,
        amount: planConfig.amount,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://polowo.vercel.app"}/api/paystack/verify?type=subscription`,
        metadata: {
          brand_id: brand.id,
          plan,
          type: "subscription",
        },
      });

      return NextResponse.json({
        authorization_url: result.data.authorization_url,
        reference: result.data.reference,
      });
    }

    if (type === "order") {
      const { items, brandId, brandName } = await request.json();

      if (!items || !brandId) {
        return NextResponse.json({ error: "Missing order data" }, { status: 400 });
      }

      const total = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      );

      const reference = `ord_${brandId}_${Date.now()}`;
      const result = await initializeTransaction({
        email: user.email!,
        amount: total,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://polowo.vercel.app"}/api/paystack/verify?type=order`,
        metadata: {
          brand_id: brandId,
          brand_name: brandName,
          items,
          type: "order",
        },
      });

      return NextResponse.json({
        authorization_url: result.data.authorization_url,
        reference: result.data.reference,
      });
    }

    return NextResponse.json({ error: "Invalid payment type" }, { status: 400 });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
