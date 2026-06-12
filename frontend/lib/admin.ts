/** Server-only admin allowlist from ADMIN_EMAILS (comma-separated). */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
