import { Router } from "express";
import { z } from "zod";
import { passwordResetEmail, sendMail, welcomeEmail } from "../services/mail.js";
import { asyncHandler } from "../utils/async-handler.js";

export const mailRouter = Router();

mailRouter.post(
  "/mail/welcome",
  asyncHandler(async (req, res) => {
    const { email, brandName } = z.object({ email: z.string().email(), brandName: z.string().min(1) }).parse(req.body);
    const { subject, html } = welcomeEmail(brandName);
    await sendMail({ to: email, subject, html });
    res.json({ success: true });
  })
);

mailRouter.post(
  "/mail/reset-password",
  asyncHandler(async (req, res) => {
    const { email, resetUrl } = z.object({ email: z.string().email(), resetUrl: z.string().url() }).parse(req.body);
    const { subject, html } = passwordResetEmail(resetUrl);
    await sendMail({ to: email, subject, html });
    res.json({ success: true });
  })
);
