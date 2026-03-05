"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import type { Brand } from "@/lib/types";
import { Crown } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setBrand(data as Brand);
        // Silently check for expiry/notifications
        fetch("/api/user/check-status", { method: "POST" }).catch(() => {});
      }

      setLoading(false);
    }

    init();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 space-y-6">
          {brand && brand.subscription_status === "trial" && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Crown size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Trial Account</h4>
                  <p className="text-xs text-muted">
                    Upgrade to <strong>Standard</strong> to get unlimited products and custom themes.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex-1 md:flex-none text-center px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  {Math.max(0, Math.ceil((new Date(brand.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left
                </div>
                <button 
                  onClick={() => router.push("/dashboard/settings")}
                  className="flex-1 md:flex-none px-6 py-2 rounded-xl bg-primary text-black text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
          {brand && (
            <DashboardContext.Provider value={{ brand, setBrand }}>
              {children}
            </DashboardContext.Provider>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

import { createContext, useContext } from "react";

interface DashboardContextType {
  brand: Brand;
  setBrand: (brand: Brand) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardLayout");
  return ctx;
}
