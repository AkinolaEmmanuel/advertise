"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight"
            >
              Create a personalized online store for{" "}
              <span className="text-red-200 underline decoration-white/20 underline-offset-8">
                your products
              </span>{" "}
              in 60 seconds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base text-muted max-w-lg leading-relaxed"
            >
              The visual-first storefront for small businesses. Share one link, showcase
              everything, receive orders via Whatsapp.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all text-sm uppercase tracking-wider"
              >
                Start Free for 7 Days
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/brands"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-all text-sm uppercase tracking-wider"
              >
                Discover Brands
              </Link>
            </motion.div>

      
          </div>

          <div className="relative lg:pl-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/hero.png"
                  alt="Seller showcasing products on their online storefront"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -24, y: 24 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 w-36 sm:w-44"
              >
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                  <Image
                    src="/hero-illustration.png"
                    alt="Online store illustration"
                    width={180}
                    height={180}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
