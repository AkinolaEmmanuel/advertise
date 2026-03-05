import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_ACCOUNTS = [
  {
    email: "akinola@gmail.com",
    password: "AdminPassword123",
    isAdmin: true,
  }
];

const TEST_ACCOUNTS = [
  {
    email: "trial@test.com",
    password: "Test1234",
    brandName: "Trial Brand",
    subscription_status: "trial",
    plan_type: "free",
  },
  {
    email: "standard@test.com",
    password: "Test1234",
    brandName: "Standard Brand",
    subscription_status: "active",
    plan_type: "standard",
  },
  {
    email: "pro@test.com",
    password: "Test1234",
    brandName: "Pro Brand",
    subscription_status: "active",
    plan_type: "pro",
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const results: { email: string; status: string }[] = [];

  // Seed Admin Accounts
  for (const account of ADMIN_ACCOUNTS) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { role: "admin" }
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        results.push({ email: account.email, status: "Already exists" });
      } else {
        results.push({ email: account.email, status: `Auth error: ${authError.message}` });
      }
      continue;
    }
    results.push({ email: account.email, status: "Created Admin" });
  }

  // Seed Brand Accounts
  for (const account of TEST_ACCOUNTS) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        results.push({ email: account.email, status: "Already exists" });
      } else {
        results.push({ email: account.email, status: `Auth error: ${authError.message}` });
      }
      continue;
    }

    if (!authData.user) {
      results.push({ email: account.email, status: "No user created" });
      continue;
    }

    const slug = generateSlug(account.brandName);
    const isPaid = account.plan_type === "standard" || account.plan_type === "pro";
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const { error: brandError } = await supabase.from("brands").insert({
      user_id: authData.user.id,
      name: account.brandName,
      slug,
      subscription_status: account.subscription_status,
      plan_type: account.plan_type,
      subscription_ends_at: isPaid ? expiry.toISOString() : null,
      bio: `This is a ${account.subscription_status} test account`,
      whatsapp: "2348000000000",
    });

    if (brandError) {
      results.push({ email: account.email, status: `Brand error: ${brandError.message}` });
      continue;
    }

    results.push({ email: account.email, status: "Created Brand Account" });
  }

  return NextResponse.json({
    message: "Platform seeded successfully",
    accounts: results,
    credentials: [
      ...ADMIN_ACCOUNTS.map(a => ({ type: "Admin", email: a.email, password: a.password })),
      ...TEST_ACCOUNTS.map(a => ({ type: "Seller", email: a.email, password: a.password }))
    ],
  });
}
