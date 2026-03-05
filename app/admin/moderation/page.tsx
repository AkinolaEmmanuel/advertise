"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Info, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface FlaggedBrand {
  id: string;
  name: string;
  slug: string;
  is_flagged: boolean;
  created_at: string;
}

export default function ModerationPage() {
  const [brands, setBrands] = useState<FlaggedBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFlagged();
  }, []);

  async function fetchFlagged() {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setBrands(data.filter(b => b.is_flagged));
      } else {
        setBrands([]);
        toast.error(data.error || "Failed to load flagged accounts");
      }
    } catch (error) {
      setBrands([]);
      toast.error("Failed to load flagged accounts");
    } finally {
      setIsLoading(false);
    }
  }

  async function resolve(id: string, removeFlag: boolean) {
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_flagged: !removeFlag }),
      });
      if (!res.ok) throw new Error();
      toast.success(removeFlag ? "Account cleared" : "Action taken");
      fetchFlagged();
    } catch {
      toast.error("Process failed");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Moderation Queue</h1>
        <p className="text-muted mt-1">Review and resolve flagged accounts.</p>
      </div>

      {isLoading ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-muted animate-pulse">Loading queue...</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Queue Clear</h2>
          <p className="text-muted">No accounts are currently flagged for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-surface border border-danger/20 rounded-2xl p-6 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-danger/10 text-danger">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{brand.name}</h3>
                  <p className="text-sm text-muted">/{brand.slug}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Joined {new Date(brand.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => resolve(brand.id, true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => resolve(brand.id, false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 text-danger text-sm font-bold hover:bg-danger/20 transition-colors cursor-pointer"
                >
                  <XCircle size={16} />
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
