/** Client-side admin allowlist from NEXT_PUBLIC_ADMIN_EMAILS (comma-separated). */
export function getPublicAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isPublicAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getPublicAdminEmails().includes(email.trim().toLowerCase());
}
