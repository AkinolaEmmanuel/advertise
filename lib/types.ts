export interface Brand {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    bio: string | null;
    logo_url: string | null;
    whatsapp: string | null;
    instagram: string | null;
    telegram: string | null;
    subscription_status: "trial" | "active" | "expired" | "cancelled";
    trial_ends_at: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    brand_id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
