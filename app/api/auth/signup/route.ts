import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  brandName: z.string().min(2).max(50),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = signupSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { email, password, brandName } = result.data;

    const supabase = createAdminClient();

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    let slug = generateSlug(brandName);
    const reservedSlugs = ["admin", "login", "signup", "dashboard", "api", "auth", "static", "public"];

    const { data: existingSlug } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if ((existingSlug && existingSlug.length > 0) || reservedSlugs.includes(slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const { error: brandError } = await supabase.from("brands").insert({
      user_id: authData.user.id,
      name: brandName.trim(),
      slug,
    });

    if (brandError) {
      console.error("Brand creation error:", brandError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Failed to create brand. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
