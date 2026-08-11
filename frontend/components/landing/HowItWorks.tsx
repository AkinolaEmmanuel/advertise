"use client";

import { motion } from "framer-motion";
import { Palette, ShoppingBag, MessageCircle } from "lucide-react";
import SectionHeader from "@/components/marketing/SectionHeader";

const steps = [
  {
    step: "01",
    title: "Create your brand",
    desc: "Sign up in 60 seconds. Pick your store name and get a unique link instantly.",
    icon: Palette,
  },
  {
    step: "02",
    title: "Add your products",
    desc: "Upload photos, set prices, and toggle what's live. Unlimited products, free.",
    icon: ShoppingBag,
  },
  {
    step: "03",
    title: "Share & sell",
    desc: "Drop your link in bio, DMs, or status. Customers order via WhatsApp or transfer.",
    icon: MessageCircle,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 border-t border-border bg-surface/30">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Live in 3 simple steps"
          subtitle="No tech skills needed. If you can send a WhatsApp message, you can run pòlówó."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-2xl border border-border bg-surface mx-auto md:mx-0 mb-5 flex items-center justify-center">
                <item.icon size={26} className="text-accent" />
              </div>
              <span className="text-xs font-bold text-muted uppercase tracking-widest">
                Step {item.step}
              </span>
              <h3 className="font-display font-semibold text-foreground text-lg mt-2 mb-2">
                {item.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-5 w-10 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
