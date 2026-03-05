"use client";

import { useDashboard } from "../layout";
import { BarChart3, Lock, TrendingUp, Users, Smartphone, Globe, Landmark } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const { brand } = useDashboard();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPro = brand.plan_type === "pro";

  useEffect(() => {
    if (isPro) {
      fetch("/api/analytics/stats")
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [isPro]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass rounded-3xl p-10 text-center relative overflow-hidden group">
          {/* Animated Gradient Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-primary">
              <Lock size={36} />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Pro Analytics</h1>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                Unlock deep insights into your pòlówó's performance. Track visitor counts, 
                device distribution, and conversion funnels to scale your brand.
              </p>
            </div>

            <div className="py-4 space-y-3">
               <div className="flex items-center gap-3 text-left text-xs text-muted/50 grayscale">
                  <TrendingUp size={16} />
                  <span>Real-time Traffic Monitoring</span>
               </div>
               <div className="flex items-center gap-3 text-left text-xs text-muted/50 grayscale">
                  <Smartphone size={16} />
                  <span>Device & OS Distribution</span>
               </div>
               <div className="flex items-center gap-3 text-left text-xs text-muted/50 grayscale">
                  <Globe size={16} />
                  <span>Geographic Visitor Origin</span>
               </div>
            </div>

            <Button 
              onClick={() => router.push("/dashboard/settings")}
              className="w-full h-12 bg-primary text-black font-bold uppercase tracking-widest text-xs"
            >
              Upgrade to Pro — ₦5,000
            </Button>
            
            <p className="text-[10px] text-muted uppercase tracking-widest">
              Join 50+ pro brands today
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Visits", value: stats?.totalVisits || 0, icon: Users, sub: "Last 30 days" },
    { label: "WhatsApp Clicks", value: stats?.whatsappClicks || 0, icon: Smartphone, sub: `Conversion: ${stats?.conversionRate || 0}%` },
    { label: "Transfer Intents", value: stats?.transferClicks || 0, icon: Landmark, sub: "Checkout interest" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Platform Analytics</h1>
        <p className="text-muted mt-1 uppercase tracking-widest text-[10px] font-bold">Deep insights into your pòlówó performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 text-muted group-hover:text-primary transition-colors">
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-[10px] text-muted mt-2 uppercase tracking-tight font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {(!stats || stats.totalVisits === 0) ? (
        <div className="bg-surface border border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
             <BarChart3 size={32} className="text-muted/30" />
           </div>
           <h3 className="text-xl font-bold text-white">Collecting Data...</h3>
           <p className="text-muted max-w-sm mt-2 text-sm leading-relaxed">
             We've just enabled Pro Analytics for your account. It takes about 24-48 hours 
             to gather enough data to show meaningful trends.
           </p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-3xl p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Traffic Activity</h3>
            <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Last 30 Days</span>
          </div>
          
          <div className="h-64 flex items-end gap-2 px-4">
            {Object.entries(stats.dailyVisits || {}).slice(-7).map(([date, count]: [string, any], i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all relative"
                  style={{ height: `${Math.min((count / (stats.totalVisits || 1)) * 100 * 2, 100)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono mt-1 rotate-45 sm:rotate-0">
                  {date.split('/')[1]}/{date.split('/')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Icon mapping helper
const smartphone = Smartphone;
