"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "@/components/marketing/SectionHeader";

const faqs = [
  {
    q: "Is pòlówó really free?",
    a: "Yes. Unlimited products, unlimited orders, and your storefront at polowo.live/yourname — no monthly fee and no credit card required.",
  },
  {
    q: "How is this different from Bumpa or Catlog?",
    a: "Bumpa and Catlog are full business management apps (inventory, staff, expenses). pòlówó is a focused free storefront for sellers who mainly sell via WhatsApp and social — simpler setup, no subscription.",
  },
  {
    q: "Do you process card payments?",
    a: "Today customers checkout via WhatsApp or bank transfer. Card payments via Paystack are coming soon. We're honest about what's live now.",
  },
  {
    q: "Will pòlówó bring me customers?",
    a: "We won't run ads for you. You share your store link — and you can get listed on our brand directory so buyers can discover you. Your traffic, your customers.",
  },
  {
    q: "Is pòlówó a marketplace like Jumia?",
    a: "No. Your store is yours. The explore page helps discovery, but you sell directly to your customers — not through a middleman marketplace.",
  },
];

export default function CompetitiveFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-24 border-t border-border bg-surface/30">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Straight answers — no hype."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-border bg-surface overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-surface-hover transition-colors"
                >
                  <span className="font-medium text-foreground text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-4 text-sm text-muted leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
