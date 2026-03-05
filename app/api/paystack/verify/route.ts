import { NextResponse, type NextRequest } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { createAdminClient } from "@/lib/supabase/admin";

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

    if (type === "subscription" && metadata.brand_id) {
      const supabase = createAdminClient();

      await supabase
        .from("brands")
        .update({
          subscription_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", metadata.brand_id);

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
