import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Validate admin session
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
  if (!adminEmails.includes(user.email || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminClient = createAdminClient();

  try {
    // Total Brands
    const { count: totalBrands } = await adminClient
      .from("brands")
      .select("*", { count: "exact", head: true });

    // Precise MRR calculation based on plan types
    const { data: plans } = await adminClient
      .from("brands")
      .select("plan_type")
      .eq("subscription_status", "active");

    const mrr = (plans || []).reduce((acc, b) => {
      if (b.plan_type === "standard") return acc + 2500;
      if (b.plan_type === "pro") return acc + 5000;
      return acc;
    }, 0);

    const activeSubs = (plans || []).length;

    // Total Products
    const { count: totalProducts } = await adminClient
      .from("products")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      totalBrands: totalBrands || 0,
      activeSubscriptions: activeSubs,
      mrr,
      totalProducts: totalProducts || 0,
      platformGrowth: 0, 
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Stats fetch failed" }, { status: 500 });
  }
}
