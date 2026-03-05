import { createClient as createBrowserClient } from "./supabase/client";

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
        const supabase = createBrowserClient();

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

        const { error } = await supabase.from("analytic_events").insert(payload);

        if (error) {
            console.error("Analytics log error:", {
                message: error.message || "No error message",
                code: error.code || "No error code",
                details: error.details || "No details",
                hint: error.hint || "No hint",
                fullError: error
            });

            // Helpful tip if table is missing
            if (error.code === '42P01') {
                console.warn("TIP: The 'analytic_events' table does not exist. Please run the migration in supabase/schema.sql");
            }
        }
    } catch (err) {
        console.error("Analytics log failed unexpectedly:", err);
    }
}
