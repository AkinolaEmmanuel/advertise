"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Palette,
  ShoppingBag,
  Globe,
  BarChart3,
  Infinity,
} from "lucide-react";
import SectionHeader from "@/components/marketing/SectionHeader";

const features = [
  {
    icon: Infinity,
    title: "Unlimited products",
    desc: "No 5-product caps. List your full catalog for free — forever.",
    className: "md:col-span-2",
  },
  {
    icon: ShoppingBag,
    title: "Smart cart",
    desc: "Customers add multiple items and checkout in one WhatsApp message.",
    className: "",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp + bank transfer",
    desc: "Meet buyers where they already pay — DM or direct transfer.",
    className: "",
  },
  {
    icon: Palette,
    title: "Branded storefront",
    desc: "Custom colors, light or dark theme, and your own polowo.live/slug URL.",
    className: "",
  },
  {
    icon: BarChart3,
    title: "Order logs & analytics",
    desc: "Track visits, WhatsApp clicks, and every order in one dashboard.",
    className: "",
  },
  {
    icon: Globe,
    title: "Brand directory",
    desc: "Get discovered on pòlówó's explore page — share your link everywhere.",
    className: "md:col-span-2",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to sell on social"
          subtitle="Simpler than Bumpa. More generous than Myshoplet's free tier. Built for WhatsApp-first sellers."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`rounded-2xl border border-border bg-surface p-6 sm:p-7 hover:bg-surface-hover transition-colors ${feature.className}`}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center text-accent mb-4">
                <feature.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
