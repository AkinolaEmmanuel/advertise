export const RESERVED_SLUGS = [
  "admin",
  "login",
  "signup",
  "dashboard",
  "api",
  "auth",
  "static",
  "public",
  "settings",
  "products",
  "orders",
  "analytics",
  "preview",
  "explore",
  "brands",
  "renew",
  "legal",
  "terms",
  "privacy",
  "help",
  "support",
];

/** Single slug algorithm for availability checks and signup. */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug);
}
