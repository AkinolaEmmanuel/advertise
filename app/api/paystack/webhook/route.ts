import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    const signature = request.headers.get("x-paystack-signature");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { metadata, customer } = event.data;

      if (metadata?.type === "subscription" && metadata?.brand_id) {
        const supabase = createAdminClient();

        await supabase
          .from("brands")
          .update({
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", metadata.brand_id);

        console.log(
          `[Webhook] Subscription activated for brand ${metadata.brand_id}, customer ${customer.email}`
        );
      }

      if (metadata?.type === "order") {
        console.log(
          `[Webhook] Order payment received for brand ${metadata.brand_id}, customer ${customer.email}`
        );
      }
    }

    if (event.event === "subscription.disable") {
      const { subscription_code, customer } = event.data;
      console.log(
        `[Webhook] Subscription disabled: ${subscription_code}, customer ${customer.email}`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
