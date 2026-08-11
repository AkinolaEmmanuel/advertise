"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import SectionHeader from "@/components/marketing/SectionHeader";

const messages = [
  {
    from: "customer",
    text: "Hi! Do you have the Classic Tee in size M?",
  },
  {
    from: "store",
    text: "Yes! Classic Tee (M) is ₦8,500 and in stock. Want me to add it to your order?",
  },
  {
    from: "customer",
    text: "Yes please — 1 piece. I'll pay by transfer.",
  },
];

export default function WhatsAppCheckoutDemo() {
  return (
    <section className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="WhatsApp checkout"
          title="From DM to logged order in one flow"
          subtitle="Customers browse your store, add to cart, and send a pre-filled WhatsApp message. You get a clean order in your dashboard."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border bg-[#0b141a] overflow-hidden shadow-xl"
          >
            <div className="px-4 py-3 bg-[#1f2c34] flex items-center gap-2 border-b border-white/5">
              <MessageCircle size={16} className="text-[#25d366]" />
              <span className="text-sm font-semibold text-white">Your Brand Store</span>
              <span className="ml-auto text-[10px] text-white/50">online</span>
            </div>
            <div className="p-4 space-y-3 min-h-[280px] bg-[#0b141a]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.from === "customer"
                        ? "bg-[#005c4b] text-white rounded-tr-none"
                        : "bg-[#1f2c34] text-white/90 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-xl bg-[#1f2c34] px-3 py-2 text-xs text-[#25d366]">
                  <ShoppingBag size={14} />
                  Order saved to dashboard
                </div>
              </div>
            </div>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            {[
              "Customer adds items to cart on your storefront",
              "They enter name and tap Send on WhatsApp",
              "Order appears in your dashboard instantly",
              "You confirm payment and fulfil — your way",
            ].map((step) => (
              <li key={step} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                <span className="text-foreground/90 leading-relaxed">{step}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
