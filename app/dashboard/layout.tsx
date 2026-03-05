"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import type { Brand } from "@/lib/types";

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
        <div className="p-4 lg:p-8">
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
