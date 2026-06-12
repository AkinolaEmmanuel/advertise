"use client";

import { motion } from "framer-motion";
import { Palette, ShoppingBag, MessageCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create your brand",
    desc: "Sign up and set your brand name, logo, and bio in under a minute.",
    icon: Palette,
  },
  {
    step: "02",
    title: "Upload your products",
    desc: "Add photos, prices, and descriptions. Toggle what you want to show.",
    icon: ShoppingBag,
  },
  {
    step: "03",
    title: "Share & sell",
    desc: "Drop your unique link anywhere. Customers order via WhatsApp directly.",
    icon: MessageCircle,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-28 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Live in 3 simple steps</h2>
          <p className="mt-4 text-muted text-lg">No tech skills needed, ever</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl border border-white/10 bg-surface mx-auto mb-6 flex items-center justify-center">
                <item.icon size={28} className="text-white" />
              </div>
              <span className="text-xs font-bold text-muted uppercase tracking-widest">
                Step {item.step}
              </span>
              <h3 className="font-semibold text-white text-lg mt-2 mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
