import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSlug, isReservedSlug } from "@/lib/slug";
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

    const slug = generateSlug(brandName);

    if (!slug) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Please choose a valid store name." },
        { status: 400 }
      );
    }

    if (isReservedSlug(slug)) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "This store name is reserved. Please choose another." },
        { status: 400 }
      );
    }

    const { data: existingSlug } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingSlug) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "This store URL is already taken. Try a different name." },
        { status: 409 }
      );
    }

    const { error: brandError } = await supabase.from("brands").insert({
      user_id: authData.user.id,
      name: brandName.trim(),
      slug,
      subscription_status: "active",
      plan_type: "free",
    });

    if (brandError) {
      console.error("Brand creation error:", brandError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Failed to create brand. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
