"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "./layout";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getInitials } from "@/lib/utils";
import { Package, Eye, ExternalLink, Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardOverview() {
  const { brand } = useDashboard();
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0 });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, is_active")
        .eq("brand_id", brand.id);

      if (data) {
        setStats({
          totalProducts: data.length,
          activeProducts: data.filter((p) => p.is_active).length,
        });
      }
    }

    fetchStats();
  }, [brand.id]);

  const storeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${brand.slug}`;

  function copyLink() {
    navigator.clipboard.writeText(storeUrl);
    toast.success("Link copied!");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome, {brand.name}
        </h1>
        <p className="text-muted mt-1">Manage your online pòlówó</p>
      </div>

      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            getInitials(brand.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted">Your pòlówó link</p>
          <p className="text-foreground font-medium truncate">{storeUrl}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copyLink}>
            <Copy size={14} />
            Copy
          </Button>
          <Link href={`/${brand.slug}`} target="_blank">
            <Button variant="ghost" size="sm">
              <ExternalLink size={14} />
              Visit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 text-muted mb-3">
            <Package size={18} />
            <span className="text-sm font-medium">Total Products</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 text-muted mb-3">
            <Eye size={18} />
            <span className="text-sm font-medium">Active (Live)</span>
          </div>
          <p className="text-3xl font-bold text-success">{stats.activeProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/products">
          <div className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors cursor-pointer">
            <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
            <p className="text-sm text-muted">Add, edit, or toggle your product listings</p>
          </div>
        </Link>
        <Link href="/dashboard/settings">
          <div className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors cursor-pointer">
            <h3 className="font-semibold text-foreground mb-1">Brand Settings</h3>
            <p className="text-sm text-muted">Update your brand name, logo, and social links</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
