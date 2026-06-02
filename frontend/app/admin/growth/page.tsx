"use client";

import { TrendingUp, BarChart3, Users, CreditCard } from "lucide-react";

export default function GrowthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Growth & Analytics</h1>
        <p className="text-muted mt-1">Track platform expansion and revenue trends.</p>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <BarChart3 size={32} className="text-muted" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Detailed Analytics Coming Soon</h2>
        <p className="text-muted max-w-md mx-auto">
          We are currently collecting data to provide you with deep insights into MRR retention,
          conversion funnels, and brand growth cohorts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-muted" />
            <h3 className="font-bold text-white">Retention Rate</h3>
          </div>
          <p className="text-sm text-muted">Awaiting more historical data...</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-muted" />
            <h3 className="font-bold text-white">Churn Analysis</h3>
          </div>
          <p className="text-sm text-muted">Awaiting more historical data...</p>
        </div>
      </div>
    </div>
  );
}
