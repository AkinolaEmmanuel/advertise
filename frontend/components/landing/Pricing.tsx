"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { FREE_PLATFORM_FEATURES } from "@/lib/platform";
import SectionHeader from "@/components/marketing/SectionHeader";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title="Free for every seller"
          subtitle="No monthly fees. No trials that expire. No 4% order fees. No 5-product caps."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative bg-surface rounded-2xl p-8 sm:p-10 border-2 border-accent/30 shadow-lg shadow-accent/5"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full flex items-center gap-1.5">
            <Sparkles size={12} />
            100% FREE
          </div>

          <div className="text-center mb-8 pt-2">
            <p className="font-display text-5xl sm:text-6xl font-bold text-foreground">₦0</p>
            <p className="text-muted text-sm mt-2 uppercase tracking-widest font-bold">
              Forever — no credit card
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {FREE_PLATFORM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-muted">
                <Check size={15} className="text-accent shrink-0" />
                {feature}
              </li>
            ))}
            <li className="flex items-center gap-3 text-sm text-muted">
              <Check size={15} className="text-accent shrink-0" />
              Unlimited products & orders (no caps like other free tiers)
            </li>
          </ul>

          <Link
            href="/signup"
            className="block w-full text-center py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
          >
            Create your free store
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
