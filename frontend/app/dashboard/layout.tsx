"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import type { Brand } from "@/lib/types";
import { AlertCircle, Crown } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { hasCheckoutContact } from "@/lib/checkout-contact";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const { brand } = await getCurrentUser();
        if (!brand) {
          router.push("/login");
          return;
        }
        setBrand(brand);
      } catch {
        router.push("/login");
        return;
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

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-foreground">Store not found</h1>
          <p className="text-sm text-muted">
            Your account is signed in, but no storefront is linked to it. Create a new store or contact support if this looks wrong.
          </p>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Create a store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8 space-y-6">
          {!hasCheckoutContact(brand) && (
            <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-danger shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Checkout not set up</h4>
                  <p className="text-xs text-muted mt-1">
                    Add a WhatsApp number or bank account number in settings so customers can place orders.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/settings"
                className="shrink-0 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors"
              >
                Complete setup
              </Link>
            </div>
          )}
          <div className="bg-accent-soft border border-accent/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
              <Crown size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Free forever on pòlówó</h4>
              <p className="text-xs text-muted mt-1">
                Your storefront, products, orders, and analytics are included at no cost — no subscription or trial limits.
              </p>
            </div>
          </div>
          <DashboardContext.Provider value={{ brand, setBrand }}>
            {children}
          </DashboardContext.Provider>
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
