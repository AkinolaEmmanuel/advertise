import { publicApiFetch } from "./api";

export type AnalyticsEventType =
    | 'page_view'
    | 'product_click'
    | 'whatsapp_click'
    | 'transfer_click';

/**
 * Logs an event to the internal analytics system.
 * This is designed to be called from client-side components.
 */
export async function logEvent(
    brandId: string,
    eventType: AnalyticsEventType,
    productId?: string,
    metadata: any = {}
) {
    if (!brandId) return;

    try {
        const payload: any = {
            brand_id: brandId,
            event_type: eventType,
            metadata: {
                ...metadata,
                url: typeof window !== 'undefined' ? window.location.href : '',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            }
        };

        // Only include product_id if it's a valid string/UUID
        if (productId && productId.trim()) {
            payload.product_id = productId;
        }

        await publicApiFetch("/api/analytics/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error("Analytics log failed unexpectedly:", err);
    }
}
