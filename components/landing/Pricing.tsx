"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { FREE_PLATFORM_FEATURES } from "@/lib/platform";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-28 border-t border-white/5">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Free for every seller</h2>
          <p className="mt-4 text-muted text-lg">
            No monthly fees. No trials that expire. Build your store and start selling today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative bg-surface rounded-2xl p-8 sm:p-10 border border-white/20"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-xs font-bold rounded-full flex items-center gap-1.5">
            <Sparkles size={12} />
            100% FREE
          </div>

          <div className="text-center mb-8 pt-2">
            <p className="text-5xl sm:text-6xl font-bold text-white">₦0</p>
            <p className="text-muted text-sm mt-2 uppercase tracking-widest font-bold">
              Forever — no credit card
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {FREE_PLATFORM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-muted">
                <Check size={15} className="text-white shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="block w-full text-center py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
          >
            Create your free store
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
