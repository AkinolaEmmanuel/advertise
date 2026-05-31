import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const bearer = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");

  const {
    data: { user },
  } = bearer
    ? await supabase.auth.getUser(bearer)
    : await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redirect = isAdminEmail(user.email) ? "/admin" : "/dashboard";
  return NextResponse.json({ redirect });
}
