import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  appUrl: process.env.APP_URL || process.env.FRONTEND_URL || "http://localhost:3000",
  adminEmails: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
  adminSetupKey: process.env.ADMIN_SETUP_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "re_dummy_fallback",
  fromEmail: process.env.FROM_EMAIL || "polowo <noreply@polowo.live>",
  emailEnabled: process.env.ENABLE_EMAIL === "true",
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || "",
  paystackStandardPlanCode: process.env.PAYSTACK_STANDARD_PLAN_CODE || "",
  paystackProPlanCode: process.env.PAYSTACK_PRO_PLAN_CODE || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

if (!config.databaseUrl) {
  console.warn("DATABASE_URL is not set. Database-backed routes will fail until it is configured.");
}

if (config.jwtSecret === "dev-only-change-me") {
  console.warn("JWT_SECRET is using the development fallback. Set JWT_SECRET before production use.");
}

if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
  console.warn("Cloudinary upload signing is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
}
