import { createAdminClient } from "./supabase/admin";
import { sendMail } from "./mail";

export async function checkAndNotifyExpiry(userId: string) {
  const supabase = createAdminClient();

  // Get brand info with user email
  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("*, users!inner(email)")
    .eq("user_id", userId)
    .single();

  if (brandError || !brand) return;

  const now = new Date();

  // 1. Check if trial just expired
  const trialEnd = new Date(brand.trial_ends_at);
  if (brand.subscription_status === 'trial' && now > trialEnd) {
    await supabase.from("brands").update({ subscription_status: 'expired' }).eq("id", brand.id);

    await sendMail({
      to: (brand as any).users.email,
      subject: "Your pòlówó Trial has Expired",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: -1px;">Trial Expired</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hi ${brand.name}, your 7-day free trial on pòlówó has come to an end. 
            Your public pòlówó is now restricted.
          </p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Upgrade to Standard for ₦5,000/mo to:</p>
            <ul style="color: #666; margin-top: 10px;">
              <li>Keep your pòlówó live</li>
              <li>Unlock unlimited products</li>
              <li>Get your verification badge</li>
            </ul>
          </div>
          <a href="https://polowo.app/dashboard/renew" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Renew Now</a>
        </div>
      `
    });
    return;
  }

  // 2. Check if paid subscription just expired
  if (brand.subscription_status === 'active' && brand.subscription_ends_at) {
    const subEnd = new Date(brand.subscription_ends_at);
    if (now > subEnd) {
      await supabase.from("brands").update({ subscription_status: 'expired' }).eq("id", brand.id);

      await sendMail({
        to: (brand as any).users.email,
        subject: "Action Required: Your Subscription has Expired",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #000; text-transform: uppercase;">Subscription Expired</h1>
            <p style="color: #666; font-size: 16px;">
              Your active subscription for <strong>${brand.name}</strong> has expired. 
              To avoid losing orders, please renew your plan immediately.
            </p>
            <a href="https://polowo.app/dashboard/renew" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold;">Renew Subscription</a>
          </div>
        `
      });
    }
  }
}
