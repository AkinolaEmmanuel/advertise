import { Resend } from "resend";
import { config } from "../config.js";
import { logger } from "../utils/logger.js";

const resend = new Resend(config.resendApiKey);

export async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!config.emailEnabled) {
    logger.info("[email disabled]", { to: options.to, subject: options.subject });
    return { id: "email-disabled" };
  }

  const { data, error } = await resend.emails.send({
    from: config.fromEmail,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function welcomeEmail(brandName: string) {
  return {
    subject: "Welcome to Polowo",
    html: `<p>Welcome to Polowo, ${brandName}.</p><p>Your storefront is ready.</p>`,
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Reset your password",
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p>`,
  };
}
