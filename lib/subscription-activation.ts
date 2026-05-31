import type { SupabaseClient } from "@supabase/supabase-js";

export type PaidPlan = "standard" | "pro";

export function getSubscriptionEndDate(months = 1): string {
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + months);
  return expiry.toISOString();
}

export async function activateBrandSubscription(
  supabase: SupabaseClient,
  brandId: string,
  plan: PaidPlan
) {
  const { error } = await supabase
    .from("brands")
    .update({
      subscription_status: "active",
      plan_type: plan,
      subscription_ends_at: getSubscriptionEndDate(),
      is_verified: plan === "standard",
      updated_at: new Date().toISOString(),
    })
    .eq("id", brandId);

  if (error) throw error;
}

export async function expireBrandSubscription(
  supabase: SupabaseClient,
  brandId: string
) {
  const { error } = await supabase
    .from("brands")
    .update({
      subscription_status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", brandId);

  if (error) throw error;
}
