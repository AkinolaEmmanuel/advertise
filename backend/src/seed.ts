import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, sql } from "./db/index.js";
import { brands, products, users } from "./db/schema.js";

async function main() {
  const email = "admin@polowo.live";
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    console.log("Seed user already exists");
    return;
  }

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash: await bcrypt.hash("password123", 12) })
    .returning();
  const [brand] = await db
    .insert(brands)
    .values({
      userId: user.id,
      name: "Demo Store",
      slug: "demo-store",
      whatsapp: "2348000000000",
      planType: "pro",
      subscriptionStatus: "active",
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .returning();
  await db.insert(products).values([
    { brandId: brand.id, name: "Sample Product", description: "Demo item", price: "2500", imageUrl: "", quantity: 10 },
    { brandId: brand.id, name: "Second Product", description: "Another demo item", price: "5000", imageUrl: "", quantity: 5 },
  ]);

  console.log("Seeded admin@polowo.live / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end();
  });
