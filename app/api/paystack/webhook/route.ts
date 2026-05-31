import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  activateBrandSubscription,
  expireBrandSubscription,
  type PaidPlan,
} from "@/lib/subscription-activation";
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
    const supabase = createAdminClient();

    if (event.event === "charge.success") {
      const { metadata, customer } = event.data;

      if (metadata?.type === "subscription" && metadata?.brand_id && metadata?.plan) {
        const plan = metadata.plan as PaidPlan;
        if (plan === "standard" || plan === "pro") {
          await activateBrandSubscription(supabase, metadata.brand_id, plan);
        }

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
      let brandId = event.data?.metadata?.brand_id as string | undefined;
      const customerEmail = event.data?.customer?.email as string | undefined;

      if (!brandId && customerEmail) {
        const { data: usersData } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });
        const authUser = usersData?.users?.find((u) => u.email === customerEmail);
        if (authUser) {
          const { data: brand } = await supabase
            .from("brands")
            .select("id")
            .eq("user_id", authUser.id)
            .maybeSingle();
          brandId = brand?.id;
        }
      }

      if (brandId) {
        await expireBrandSubscription(supabase, brandId);
        console.log(`[Webhook] Subscription disabled for brand ${brandId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
