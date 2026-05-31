import { NextResponse, type NextRequest } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  activateBrandSubscription,
  type PaidPlan,
} from "@/lib/subscription-activation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  const type = searchParams.get("type");

  const ref = reference || trxref;

  if (!ref) {
    return NextResponse.redirect(
      new URL("/dashboard?payment=failed", request.url)
    );
  }

  try {
    const result = await verifyTransaction(ref);

    if (result.data.status !== "success") {
      return NextResponse.redirect(
        new URL("/dashboard?payment=failed", request.url)
      );
    }

    const metadata = result.data.metadata as {
      brand_id?: string;
      plan?: string;
      type?: string;
    };

    if (type === "subscription" && metadata.brand_id && metadata.plan) {
      const plan = metadata.plan as PaidPlan;
      if (plan === "standard" || plan === "pro") {
        const supabase = createAdminClient();
        await activateBrandSubscription(supabase, metadata.brand_id, plan);
      }

      return NextResponse.redirect(
        new URL("/dashboard/settings?payment=success", request.url)
      );
    }

    if (type === "order") {
      const brandSlug = searchParams.get("slug");
      const redirectPath = brandSlug ? `/${brandSlug}?payment=success` : "/dashboard?payment=success";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.redirect(
      new URL("/dashboard?payment=success", request.url)
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?payment=failed", request.url)
    );
  }
}
