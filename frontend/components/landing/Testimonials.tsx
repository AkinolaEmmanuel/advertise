"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/marketing/SectionHeader";

const testimonials = [
  {
    name: "Amaka O.",
    role: "Fashion brand · Lagos",
    text: "I replaced DM price lists with one link. First WhatsApp order same day — and it's actually free, no product limit.",
  },
  {
    name: "Tunde K.",
    role: "Sneaker reseller · Abuja",
    text: "My customers add to cart and send one WhatsApp message. I see every order in the dashboard. Way better than Notes app chaos.",
  },
  {
    name: "Blessing A.",
    role: "Skincare brand · Port Harcourt",
    text: "I didn't need Bumpa's full inventory system — just a clean store and bank details. pòlówó was live in minutes.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <SectionHeader
          eyebrow="Sellers like you"
          title="Built for Nigerian businesses"
          subtitle="Fashion, beauty, food, electronics — if you sell on social, pòlówó fits."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/20 transition-colors"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/85 text-sm leading-relaxed mb-5">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted mt-0.5">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
