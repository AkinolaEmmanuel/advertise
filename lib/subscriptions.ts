import { createAdminClient } from "./supabase/admin";
import { PLATFORM_IS_FREE } from "./platform";

/** Keeps legacy trial/expired brands active while the platform is free. */
export async function checkAndNotifyExpiry(userId: string) {
  if (!PLATFORM_IS_FREE) return;

  const supabase = createAdminClient();
  const { data: brand, error } = await supabase
    .from("brands")
    .select("id, subscription_status")
    .eq("user_id", userId)
    .single();

  if (error || !brand) return;

  const needsActivation =
    brand.subscription_status === "expired" ||
    brand.subscription_status === "cancelled" ||
    brand.subscription_status === "trial";

  if (needsActivation) {
    await supabase
      .from("brands")
      .update({
        subscription_status: "active",
        plan_type: "free",
        updated_at: new Date().toISOString(),
      })
      .eq("id", brand.id);
  }
}
