"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import SectionHeader from "@/components/marketing/SectionHeader";
import BrandCard, { type BrandCardData } from "@/components/marketing/BrandCard";
import { publicApiFetch } from "@/lib/api";

const categories = ["All", "Fashion", "Food", "Beauty", "Electronics"] as const;

function matchesCategory(brand: BrandCardData, category: string) {
  if (category === "All") return true;
  const haystack = `${brand.name} ${brand.bio ?? ""}`.toLowerCase();
  return haystack.includes(category.toLowerCase());
}

export default function BrandsDirectory() {
  const [brands, setBrands] = useState<BrandCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    publicApiFetch<BrandCardData[]>("/api/brands")
      .then(setBrands)
      .catch(() => setBrands([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.bio?.toLowerCase().includes(q) ?? false);
      return matchesSearch && matchesCategory(b, category);
    });
  }, [brands, searchTerm, category]);

  return (
    <MarketingShell>
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 sm:py-16 w-full pb-28 md:pb-16">
        <SectionHeader
          align="left"
          eyebrow="Explore"
          title="Discover Nigerian brands on pòlówó"
          subtitle="Independent storefronts — not a marketplace like Jumia. Visit any store and order directly with the owner."
          className="max-w-3xl"
        />

        <div className="sticky top-[4.5rem] z-40 py-3 -mx-6 px-6 bg-background/90 backdrop-blur-md border-b border-border mb-8">
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No brands found. Be the first — create your free store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </main>
    </MarketingShell>
  );
}
