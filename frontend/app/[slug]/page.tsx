import { notFound } from "next/navigation";
import StorefrontContent from "./StorefrontContent";
import { publicApiFetch } from "@/lib/api";
import type { Brand, Product } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StorefrontPage({ params }: Props) {
  const { slug } = await params;
  const data = await publicApiFetch<{ brand: Brand; products: Product[] }>(`/api/storefront/${slug}`).catch(() => null);

  if (!data) notFound();

  // Block access to flagged or expired storefronts
  const isExpired = data.brand.subscription_status === "expired" || data.brand.subscription_status === "cancelled";
  if (data.brand.is_flagged || isExpired) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">pòlówó Unavailable</h1>
        <p className="text-muted max-w-md">
          {data.brand.is_flagged 
            ? "This account has been suspended by the platform administrators."
            : "This pòlówó has expired. If you are the owner, please renew your subscription."}
        </p>
        <a href="/" className="mt-8 text-primary font-medium hover:underline">← Back to pòlówó</a>
      </div>
    );
  }

  return <StorefrontContent brand={data.brand} products={data.products} />;
}
