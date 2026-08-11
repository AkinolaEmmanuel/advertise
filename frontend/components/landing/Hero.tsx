"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, CreditCard, MessageCircle } from "lucide-react";
import StorefrontMockup from "@/components/marketing/StorefrontMockup";

const chips = [
  { icon: CreditCard, label: "No credit card" },
  { icon: MessageCircle, label: "Works with WhatsApp" },
  { icon: Clock, label: "Live in 60 seconds" },
];

export default function Hero() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-muted"
                >
                  <chip.icon size={12} className="text-accent" />
                  {chip.label}
                </span>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-tight text-foreground"
            >
              Your free storefront for{" "}
              <span className="text-accent underline decoration-accent/30 underline-offset-8">
                Easy sales
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-base sm:text-lg text-muted max-w-lg leading-relaxed"
            >
              Add unlimited products, share one link, and receive orders via WhatsApp or bank
              transfer. Built for Nigerian sellers — no monthly fees, no product caps.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all text-sm"
              >
                Create your free store
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/brands"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-surface text-foreground font-medium hover:bg-surface-hover transition-all text-sm"
              >
                Browse brands
              </Link>
            </motion.div>
          </div>

          <StorefrontMockup />
        </div>
      </div>
    </section>
  );
}
