"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BadgeCheck, Search, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  bio: string;
  is_verified: boolean;
}

export default function BrandsDirectory() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      const supabase = createClient();
      const { data } = await supabase
        .from("brands")
        .select("id, name, slug, logo_url, bio, is_verified")
        .eq("subscription_status", "active")
        .order("is_verified", { ascending: false });

      if (data) setBrands(data);
      setIsLoading(false);
    }
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Marketplace Directory</h1>
          <p className="text-muted max-w-2xl">
            Discover premium brands using our platform to power their online stores. 
            All brands listed here are active and verified by our team.
          </p>
          
          <div className="relative max-w-md pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/30 transition-all shadow-xl"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-surface rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-white/5 rounded-3xl">
             <p className="text-muted">No brands found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <Link 
                key={brand.id} 
                href={`/${brand.slug}`}
                target="_blank"
                className="group relative bg-surface border border-white/5 rounded-3xl p-8 hover:border-primary/20 transition-all hover:shadow-2xl hover:-translate-y-1 block overflow-hidden"
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                   <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                     <ExternalLink size={18} />
                   </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center text-xl font-bold">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
                    ) : (
                      brand.name[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white uppercase tracking-tight">{brand.name}</h3>
                      {brand.is_verified && <BadgeCheck size={16} className="text-primary" />}
                    </div>
                    <p className="text-xs text-muted">polowo.live/{brand.slug}</p>
                  </div>
                </div>

                {brand.bio && (
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-6">
                    {brand.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                  Visit store <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
