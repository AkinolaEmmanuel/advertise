import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StorefrontShell from "./StorefrontShell";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name, bio")
    .eq("slug", slug)
    .single();

  if (!brand) return { title: "Not Found" };

  return {
    title: `${brand.name} — Advertise`,
    description: brand.bio || `Browse ${brand.name}'s products on Advertise`,
  };
}

export default async function StorefrontLayout({ params, children }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!brand) notFound();

  return <StorefrontShell brand={brand}>{children}</StorefrontShell>;
}
