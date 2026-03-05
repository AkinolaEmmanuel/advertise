import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { welcomeEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const { email, brandName } = await request.json();

    if (!email || !brandName) {
      return NextResponse.json(
        { error: "Email and brand name are required" },
        { status: 400 }
      );
    }

    const { subject, html } = welcomeEmail(brandName);
    await sendMail({ to: email, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}
