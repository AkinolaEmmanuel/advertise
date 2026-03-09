"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Eye,
  MessageCircle,
  Palette,
  ShoppingBag,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Storefront Aesthetic",
    desc: "Premium visual-first product display that makes your brand look professional",
  },
  {
    icon: ShoppingBag,
    title: "Smart Cart",
    desc: "Customers add multiple items and checkout via one WhatsApp message",
  },
  {
    icon: MessageCircle,
    title: "DM Checkout",
    desc: "Pre-filled WhatsApp messages with complete order details for easy sales",
  },
  {
    icon: Zap,
    title: "60-Second Setup",
    desc: "Sign up, upload products, share your link. That's it. No complex setup.",
  },
  {
    icon: Eye,
    title: "Live Toggle",
    desc: "Show or hide products instantly with simple on/off switches",
  },
  {
    icon: Globe,
    title: "One Link for All",
    desc: "Share polowo.live/yourname everywhere — bio, DMs, everywhere",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to sell visually</h2>
          <p className="mt-4 text-muted text-lg max-w-xl mx-auto">
            Simpler than Shopify, more powerful than a social media link
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-surface p-8 hover:bg-surface-hover transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white mb-5 transition-transform group-hover:scale-110">
                <feature.icon size={18} />
              </div>
              <h3 className="font-semibold text-white text-base mb-2 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-surface border border-white/5 rounded-2xl p-7 min-w-[260px] w-[80vw] snap-center shrink-0"
            >
              <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white mb-5">
                <feature.icon size={18} />
              </div>
              <h3 className="font-semibold text-white text-base mb-2 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="md:hidden flex justify-center gap-1.5 mt-4">
          {features.map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  );
}
