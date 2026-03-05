import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_fallback");

const FROM_EMAIL = process.env.FROM_EMAIL || "pòlówó <noreply@polowo.app>";
const EMAIL_ENABLED = process.env.ENABLE_EMAIL === "true";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  if (!EMAIL_ENABLED) {
    console.log(`[Mail Skipped] To: ${to} | Subject: ${subject}`);
    return { id: "skipped" };
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
