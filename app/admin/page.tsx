"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  DollarSign, 
  Eye, 
  ArrowUpRight, 
  TrendingUp,
  Briefcase,
  Clock,
  CheckCircle2
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Stats {
  totalBrands: number;
  activeSubscriptions: number;
  mrr: number;
  totalProducts: number;
  platformGrowth: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  subscription_status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBrands, setRecentBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, brandsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/brands")
        ]);
        
        const statsData = await statsRes.json();
        const brandsData = await brandsRes.json();
        
        if (statsRes.ok) setStats(statsData);
        if (brandsRes.ok && Array.isArray(brandsData)) {
          setRecentBrands(brandsData.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl" />
          <div className="h-96 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Monthly Revenue (MRR)",
      value: formatPrice(stats?.mrr || 0),
      icon: DollarSign,
      trend: "0%",
      sub: "Active standard plan"
    },
    {
      label: "Total Brands",
      value: stats?.totalBrands || 0,
      icon: Users,
      trend: "0%",
      sub: "Lifetime businesses"
    },
    {
      label: "Active Premium",
      value: stats?.activeSubscriptions || 0,
      icon: Crown,
      trend: "0%",
      sub: "Standard/Pro users"
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Briefcase,
      trend: "0%",
      sub: "Inventory items"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
          <p className="text-muted mt-1">Real-time performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <Clock size={14} />
          Last updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 text-muted">
                <card.icon size={20} />
              </div>
              <span className="text-xs font-medium text-muted flex items-center gap-1">
                {card.trend}
              </span>
            </div>
            <h2 className="text-muted text-sm font-medium">{card.label}</h2>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-muted" />
              Growth Curve
            </h3>
          </div>
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <TrendingUp size={24} className="text-muted/50" />
             </div>
             <p className="text-sm text-muted max-w-[200px]">Historical growth data will appear here as more brands join.</p>
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Recent Signups</h3>
            <Link href="/admin/brands" className="text-[10px] text-muted hover:text-white uppercase tracking-wider font-bold">View All</Link>
          </div>
          <div className="space-y-4">
            {recentBrands.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No signups yet</p>
            ) : (
              recentBrands.map((brand) => (
                <div key={brand.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                    {brand.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{brand.name}</p>
                    <p className="text-[10px] text-muted">{new Date(brand.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                    brand.subscription_status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-muted'
                  }`}>
                    {brand.subscription_status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Crown({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
