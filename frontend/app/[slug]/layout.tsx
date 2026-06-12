import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StorefrontShell from "./StorefrontShell";
import { publicApiFetch } from "@/lib/api";
import type { Brand, Product } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await publicApiFetch<{ brand: Brand; products: Product[] }>(`/api/storefront/${slug}`).catch(() => null);

  if (!data) return { title: "Not Found" };

  return {
    title: `${data.brand.name} — pòlówó`,
    description: data.brand.bio || `Browse ${data.brand.name}'s products on pòlówó`,
  };
}

export default async function StorefrontLayout({ params, children }: Props) {
  const { slug } = await params;
  const data = await publicApiFetch<{ brand: Brand; products: Product[] }>(`/api/storefront/${slug}`).catch(() => null);

  if (!data) notFound();

  return <StorefrontShell brand={data.brand}>{children}</StorefrontShell>;
}
