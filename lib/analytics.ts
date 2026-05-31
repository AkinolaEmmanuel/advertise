export type AnalyticsEventType =
  | "page_view"
  | "product_click"
  | "whatsapp_click"
  | "transfer_click";

/**
 * Logs an event via the validated server API (no direct DB insert from the client).
 */
export async function logEvent(
  brandId: string,
  eventType: AnalyticsEventType,
  productId?: string,
  metadata: Record<string, unknown> = {}
) {
  if (!brandId) return;

  try {
    const payload: Record<string, unknown> = {
      brand_id: brandId,
      event_type: eventType,
      metadata: {
        ...metadata,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };

    if (productId?.trim()) {
      payload.product_id = productId.trim();
    }

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Analytics log failed:", err);
  }
}
