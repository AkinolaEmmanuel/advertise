"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PolowoLogo from "@/components/brand/PolowoLogo";
import TrustBadges from "@/components/marketing/TrustBadges";

export default function CallToAction() {
  return (
    <section className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <PolowoLogo variant="mark" size="lg" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground"
        >
          Ready to sell smarter on WhatsApp?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted text-lg mb-8"
        >
          Join Nigerian sellers using pòlówó — free forever, no product limits.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary-hover transition-all"
          >
            Create your free store
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-medium hover:bg-surface transition-all"
          >
            Explore brands
          </Link>
        </motion.div>
        <TrustBadges />
      </div>
    </section>
  );
}
