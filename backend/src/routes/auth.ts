import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { db } from "../db/index.js";
import { brands, users } from "../db/schema.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import type { AuthedRequest } from "../types.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/errors.js";
import { generateSlug, reservedSlugs } from "../utils/slug.js";
import { publicUser, serializeBrand } from "../utils/serialize.js";
import { passwordResetEmail, sendMail } from "../services/mail.js";

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  brandName: z.string().min(2).max(50),
});

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, password, brandName } = signupSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();
    const [existingUser] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (existingUser) {
      throw new HttpError(409, "An account with this email already exists. Please sign in.");
    }

    let slug = generateSlug(brandName);
    if (!slug || reservedSlugs.has(slug)) {
      slug = `${slug || "brand"}-${Date.now().toString(36)}`;
    }

    const [existingSlug] = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, slug)).limit(1);
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({ email: normalizedEmail, passwordHash })
      .returning();

    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [brand] = await db
      .insert(brands)
      .values({ userId: user.id, name: brandName.trim(), slug, trialEndsAt })
      .returning();

    const token = signToken({ userId: user.id, email: user.email });
    res.status(201).json({ token, user: publicUser(user), brand: serializeBrand(brand), success: true });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password");
    }

    const [brand] = await db.select().from(brands).where(eq(brands.userId, user.id)).limit(1);
    const token = signToken({ userId: user.id, email: user.email });
    res.json({ token, user: publicUser(user), brand: brand ? serializeBrand(brand) : null });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const authed = req as AuthedRequest;
    const [user] = await db.select().from(users).where(eq(users.id, authed.user.userId)).limit(1);
    if (!user) throw new HttpError(401, "Unauthorized");
    const [brand] = await db.select().from(brands).where(eq(brands.userId, user.id)).limit(1);
    res.json({ user: publicUser(user), brand: brand ? serializeBrand(brand) : null });
  })
);

authRouter.get(
  "/check-availability",
  asyncHandler(async (req, res) => {
    const name = z.string().min(2).safeParse(req.query.name);
    if (!name.success) {
      res.json({ available: false, error: "Too short" });
      return;
    }

    const slug = generateSlug(name.data);
    if (!slug || reservedSlugs.has(slug)) {
      res.json({ available: false, error: "Reserved name" });
      return;
    }

    const [existing] = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, slug)).limit(1);
    res.json({ available: !existing, slug });
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);

    if (user) {
      const token = randomUUID().replaceAll("-", "");
      const resetTokenHash = await bcrypt.hash(token, 10);
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await db.update(users).set({ resetTokenHash, resetTokenExpiresAt }).where(eq(users.id, user.id));
      const resetUrl = `${config.appUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
      const { subject, html } = passwordResetEmail(resetUrl);
      await sendMail({ to: user.email, subject, html });
    }

    res.json({ success: true });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { email, token, password } = z
      .object({ email: z.string().email(), token: z.string().min(10), password: z.string().min(6) })
      .parse(req.body);
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);

    if (!user?.resetTokenHash || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    const validToken = await bcrypt.compare(token, user.resetTokenHash);
    if (!validToken) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    await db
      .update(users)
      .set({
        passwordHash: await bcrypt.hash(password, 12),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    res.json({ success: true });
  })
);
