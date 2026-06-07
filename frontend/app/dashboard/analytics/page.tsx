"use client";

import { useDashboard } from "../layout";
import { BarChart3, TrendingUp, Smartphone, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface AnalyticsStats {
  totalVisits: number;
  whatsappClicks: number;
  transferClicks: number;
  conversionRate: number;
  dailyVisits: Record<string, number>;
}

export default function AnalyticsPage() {
  const { brand } = useDashboard();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<AnalyticsStats>("/api/analytics/stats")
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Store Visits (30d)",
      value: stats?.totalVisits || 0,
      icon: Globe,
      sub: "Unique page views",
    },
    {
      label: "WhatsApp Clicks",
      value: stats?.whatsappClicks || 0,
      icon: Smartphone,
      sub: `Conversion: ${stats?.conversionRate || 0}%`,
    },
    {
      label: "Transfer Views",
      value: stats?.transferClicks || 0,
      icon: TrendingUp,
      sub: "Bank details opened",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="text-primary" />
          Analytics
        </h1>
        <p className="text-muted mt-1 text-sm">
          Included free with your {brand.name} storefront.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 text-muted mb-4">
              <card.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-muted mt-2">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
