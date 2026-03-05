import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { passwordResetEmail } from "@/lib/email-templates";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback?next=/dashboard`,
      },
    });

    if (error || !data?.properties?.action_link) {
      return NextResponse.json({ success: true });
    }

    const resetUrl = data.properties.action_link;
    const { subject, html } = passwordResetEmail(resetUrl);
    await sendMail({ to: email, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset email error:", error);
    return NextResponse.json({ success: true });
  }
}
