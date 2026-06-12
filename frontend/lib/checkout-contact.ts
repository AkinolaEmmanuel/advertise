const MIN_DIGITS = 10;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function hasWhatsAppContact(whatsapp: string | null | undefined): boolean {
  return digitsOnly(whatsapp ?? "").length >= MIN_DIGITS;
}

export function hasBankAccountContact(accountNumber: string | null | undefined): boolean {
  return digitsOnly(accountNumber ?? "").length >= MIN_DIGITS;
}

export function hasCheckoutContact(brand: {
  whatsapp?: string | null;
  account_number?: string | null;
}): boolean {
  return (
    hasWhatsAppContact(brand.whatsapp) ||
    hasBankAccountContact(brand.account_number)
  );
}

export function validateCheckoutContactInput(
  whatsapp: string,
  accountNumber: string
): { ok: true } | { ok: false; message: string } {
  if (hasWhatsAppContact(whatsapp) || hasBankAccountContact(accountNumber)) {
    return { ok: true };
  }
  return {
    ok: false,
    message:
      "Add a WhatsApp number or bank account number (at least 10 digits) so customers can checkout.",
  };
}
