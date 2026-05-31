import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/lib/types";
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

  if (brand.is_flagged) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">pòlówó Unavailable</h1>
        <p className="text-muted max-w-md">
          This account has been suspended by the platform administrators.
        </p>
        <Link href="/" className="mt-8 text-primary font-medium hover:underline">← Back to pòlówó</Link>
      </div>
    );
  }

  const products = (brand.products || []) as Product[];
  const activeProducts = products
    .filter((p) => p.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return <StorefrontContent brand={brand} products={activeProducts} />;
}
