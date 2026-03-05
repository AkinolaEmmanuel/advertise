import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("Admin API: No user found in session");
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
  console.log(`Admin API: Checking access for ${user.email} against [${adminEmails.join(", ")}]`);

  if (!adminEmails.includes(user.email || "")) {
    console.log(`Admin API: ${user.email} is NOT in the admin list`);
    return NextResponse.json({ error: "Not an admin" }, { status: 403 });
  }

  const adminClient = createAdminClient();

  try {
    const { data: brands, error } = await adminClient
      .from("brands")
      .select("id, name, slug, subscription_status, plan_type, trial_ends_at, subscription_ends_at, created_at, is_flagged, is_verified")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error fetching brands:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(brands);
  } catch (error: any) {
    console.error("API error fetching brands:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
