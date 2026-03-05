"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MoreVertical, ExternalLink, Calendar, Flag, ShieldAlert, Clock, BadgeCheck, History } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Brand {
  id: string;
  name: string;
  slug: string;
  subscription_status: "trial" | "active" | "expired" | "cancelled";
  plan_type: "free" | "standard" | "pro";
  trial_ends_at: string;
  subscription_ends_at: string;
  created_at: string;
  is_flagged?: boolean;
  is_verified?: boolean;
}

export default function BrandsAdmin() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setBrands(data);
      } else {
        setBrands([]);
        toast.error(data.error || "Failed to load brands");
      }
    } catch (error) {
      setBrands([]);
      toast.error("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePlan(id: string, plan: string) {
    try {
      const isPaid = plan === "standard" || plan === "pro";
      const payload: any = {
        plan_type: plan,
        subscription_status: isPaid ? "active" : (plan === "free" ? "trial" : "active"),
      };

      if (isPaid) {
        // Set expiry to 30 days from now
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        payload.subscription_ends_at = expiry.toISOString();
      } else {
        payload.subscription_ends_at = null;
      }

      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success(`Plan updated to ${plan}`);
      fetchBrands();
    } catch {
      toast.error("Failed to update plan");
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription_status: status }),
      });
      if (!res.ok) throw new Error();
      toast.success("Updated subscription status");
      fetchBrands();
    } catch {
      toast.error("Update failed");
    }
  }

  async function toggleFlag(id: string, isFlagged: boolean) {
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_flagged: !isFlagged }),
      });
      if (!res.ok) throw new Error();
      toast.success(isFlagged ? "Flag removed" : "Account flagged");
      fetchBrands();
    } catch {
      toast.error("Moderation failed");
    }
  }

  async function toggleVerification(id: string, isVerified: boolean) {
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_verified: !isVerified }),
      });
      if (!res.ok) throw new Error();
      toast.success(isVerified ? "Verification removed" : "Brand verified");
      fetchBrands();
    } catch {
      toast.error("Verification update failed");
    }
  }

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brand Management</h1>
          <p className="text-muted text-sm mt-1">Manage plans, subscriptions and moderate accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-all w-64"
            />
          </div>
          <button className="p-2 rounded-xl bg-surface border border-white/5 text-muted hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-wider font-bold text-muted">
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 h-16 bg-white/[0.02]" />
                  </tr>
                ))
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted text-sm">
                    No brands found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className={`group hover:bg-white/[0.02] transition-colors ${brand.is_flagged ? "bg-danger/5" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-xs font-bold text-white">
                          {brand.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-white">{brand.name}</p>
                            {brand.is_verified && <BadgeCheck size={14} className="text-primary" />}
                          </div>
                          <p className="text-xs text-muted">/{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={brand.plan_type || "free"}
                        onChange={(e) => updatePlan(brand.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border-none outline-none cursor-pointer ${
                          brand.plan_type === "pro" ? "text-primary" : brand.plan_type === "standard" ? "text-green-400" : "text-muted"
                        }`}
                      >
                        <option value="free">Free/Trial</option>
                        <option value="standard">Standard</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={brand.subscription_status}
                        onChange={(e) => updateStatus(brand.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border-none outline-none cursor-pointer ${
                          brand.subscription_status === "active" ? "text-green-400" : brand.subscription_status === "expired" ? "text-danger" : "text-muted"
                        }`}
                      >
                        <option value="trial">Trial</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Clock size={12} />
                          {brand.subscription_ends_at 
                            ? new Date(brand.subscription_ends_at).toLocaleDateString()
                            : brand.trial_ends_at 
                              ? `${new Date(brand.trial_ends_at).toLocaleDateString()} (Trial)`
                              : "N/A"
                          }
                        </div>
                        {brand.subscription_ends_at && (
                          <span className="text-[9px] text-muted-foreground">
                            {Math.ceil((new Date(brand.subscription_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`/${brand.slug}`}
                          target="_blank"
                          title="View Storefront"
                          className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => toggleVerification(brand.id, brand.is_verified || false)}
                          title={brand.is_verified ? "Remove Verification" : "Verify Brand"}
                          className={`p-2 rounded-lg hover:bg-primary/10 transition-colors ${brand.is_verified ? "text-primary" : "text-muted hover:text-primary"}`}
                        >
                          <BadgeCheck size={16} />
                        </button>
                        <button
                          onClick={() => toggleFlag(brand.id, brand.is_flagged || false)}
                          title={brand.is_flagged ? "Unflag Account" : "Flag Account"}
                          className={`p-2 rounded-lg hover:bg-danger/10 transition-colors ${brand.is_flagged ? "text-danger" : "text-muted hover:text-danger"}`}
                        >
                          {brand.is_flagged ? <ShieldAlert size={16} /> : <Flag size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
