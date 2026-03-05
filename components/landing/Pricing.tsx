"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Standard",
    desc: "Perfect for getting started",
    price: "₦2,500",
    features: [
      "Unlimited products",
      "WhatsApp DM checkout",
      "Custom billboard URL",
      "Mobile-optimized storefront",
      "Product toggle system",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    desc: "For serious sellers",
    price: "₦5,000",
    features: [
      "Everything in Standard",
      "Paystack payment integration",
      "Custom analytics dashboard",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-28 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted text-lg">Start free, upgrade when you&apos;re ready</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className={`relative bg-surface rounded-2xl p-8 ${
                plan.highlighted ? "border border-white/20" : "border border-white/5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-xs font-bold rounded-full">
                  POPULAR
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-muted text-sm mt-1">{plan.desc}</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-muted">
                    <Check size={15} className="text-white shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "border border-white/15 text-white hover:bg-white/5 hover:border-white/30"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
