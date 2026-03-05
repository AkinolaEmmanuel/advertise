import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StorefrontContent from "./StorefrontContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StorefrontPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*, products(*)")
    .eq("slug", slug)
    .single();

  if (!brand) notFound();

  // Block access to flagged or expired storefronts
  const isExpired = brand.subscription_status === "expired" || brand.subscription_status === "cancelled";
  if (brand.is_flagged || isExpired) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">pòlówó Unavailable</h1>
        <p className="text-muted max-w-md">
          {brand.is_flagged 
            ? "This account has been suspended by the platform administrators."
            : "This pòlówó has expired. If you are the owner, please renew your subscription."}
        </p>
        <a href="/" className="mt-8 text-primary font-medium hover:underline">← Back to pòlówó</a>
      </div>
    );
  }

  const activeProducts = (brand.products || [])
    .filter((p: any) => p.is_active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order);

  return <StorefrontContent brand={brand} products={activeProducts} />;
}
