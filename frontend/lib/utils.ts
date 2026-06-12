export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function buildWhatsAppUrl(
    phone: string,
    brandName: string,
    items: { name: string; quantity: number; price: number }[],
    customer?: { name: string; phone: string }
): string {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let message = `🛒 *New Order from ${brandName}*\n\n`;

    if (customer?.name) {
        message += `👤 *Customer:* ${customer.name}\n`;
        if (customer.phone) message += `📞 *Phone:* ${customer.phone}\n`;
        message += `\n`;
    }

    message += `*Items:*\n`;
    items.forEach((item, i) => {
        message += `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\n💰 *Total: ${formatPrice(total)}*`;
    message += `\n\nSent via pòlówó`;

    const cleanPhone = phone.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
