const { createClient } = require('@supabase/supabase-js');

// Usage: node --env-file=.env.local scripts/seed-direct.js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Required environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are missing.');
  console.log('Ensure you are running with: node --env-file=.env.local scripts/seed-direct.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_ACCOUNTS = [
  {
    email: "akinola@gmail.com",
    password: "AdminPassword123",
    metadata: { role: "admin" }
  }
];

const TEST_ACCOUNTS = [
  {
    email: "trial@test.com",
    password: "Test1234",
    brandName: "Trial Brand",
    subscription_status: "trial",
  },
  {
    email: "standard@test.com",
    password: "Test1234",
    brandName: "Standard Brand",
    subscription_status: "active",
  },
  {
    email: "pro@test.com",
    password: "Test1234",
    brandName: "Pro Brand",
    subscription_status: "active",
  },
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function runSeed() {
  console.log('--- Starting Direct Database Seed ---');

  // Seed Admin
  for (const account of ADMIN_ACCOUNTS) {
    console.log(`Creating Admin: ${account.email}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: account.metadata
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log('>> Admin already exists.');
      } else {
        console.error('>> Auth Error:', error.message);
      }
    } else {
      console.log('>> Admin created successfully!');
    }
  }

  // Seed Brands
  for (const account of TEST_ACCOUNTS) {
    console.log(`Creating Seller: ${account.email}...`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('>> User already exists.');
        continue;
      }
      console.error('>> Auth Error:', authError.message);
      continue;
    }

    const slug = generateSlug(account.brandName);
    const { error: brandError } = await supabase.from("brands").insert({
      user_id: authData.user.id,
      name: account.brandName,
      slug,
      subscription_status: account.subscription_status,
      bio: `This is a ${account.subscription_status} test account`,
      whatsapp: "2348000000000",
    });

    if (brandError) {
      console.error('>> Brand Error:', brandError.message);
    } else {
      console.log('>> Brand account created successfully!');
    }
  }

  console.log('\n--- Seed Process Finished ---');
  process.exit(0);
}

runSeed();
