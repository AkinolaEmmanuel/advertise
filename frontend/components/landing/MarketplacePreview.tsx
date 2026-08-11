"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { publicApiFetch } from "@/lib/api";
import SectionHeader from "@/components/marketing/SectionHeader";
import BrandCard, { type BrandCardData } from "@/components/marketing/BrandCard";

const categories = ["All", "Fashion", "Food", "Beauty", "Electronics"] as const;

function matchesCategory(brand: BrandCardData, category: string) {
  if (category === "All") return true;
  const haystack = `${brand.name} ${brand.bio ?? ""}`.toLowerCase();
  return haystack.includes(category.toLowerCase());
}

export default function MarketplacePreview() {
  const [brands, setBrands] = useState<BrandCardData[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApiFetch<BrandCardData[]>("/api/brands")
      .then((data) => setBrands(data.slice(0, 12)))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return brands.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.bio?.toLowerCase().includes(q) ?? false);
      return matchesSearch && matchesCategory(b, category);
    });
  }, [brands, search, category]);

  const display = filtered.slice(0, 6);

  return (
    <section id="explore" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="Discover"
          title="Nigerian brands on pòlówó"
          subtitle="Browse active storefronts. Get listed automatically when you go live."
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : display.length === 0 ? (
          <p className="text-center text-muted py-12">No brands match your search yet.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {display.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            View all brands
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
