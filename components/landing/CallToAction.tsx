"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-24 sm:py-28 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Ready to build your pòlówó?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted text-lg mb-10"
        >
          Join thousands of small businesses selling smarter. Free for 7 days.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-white text-black font-semibold text-lg hover:bg-neutral-200 transition-all"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
