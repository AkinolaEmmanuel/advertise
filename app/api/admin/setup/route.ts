import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { email, password, setupKey } = await request.json();

  // This setup key should be defined in .env.local
  if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: "Unauthorized setup attempt" }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" }
    });

    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      message: "Admin user created successfully. You can now log in at /login" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
