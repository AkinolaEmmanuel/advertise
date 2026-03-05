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
    .select("id")
    .eq("slug", slug)
    .single();

  if (!brand) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("brand_id", brand.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return <StorefrontContent products={products ?? []} />;
}
