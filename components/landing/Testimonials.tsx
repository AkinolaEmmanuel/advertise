"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amaka O.",
    role: "Fashion Brand Owner",
    text: "I set up my billboard in 5 minutes and got my first WhatsApp order the same day. This is everything I needed.",
  },
  {
    name: "Tunde K.",
    role: "Sneaker Reseller",
    text: "My customers love how easy it is to browse and order. The WhatsApp checkout is genius — no friction at all.",
  },
  {
    name: "Blessing A.",
    role: "Skincare Brand",
    text: "I was using Instagram DMs for everything. Now I just share one link and my products sell themselves. Game changer.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-28 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Loved by small businesses</h2>
          <p className="mt-4 text-muted text-lg">Join hundreds of sellers already using Advertise</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-surface border border-white/5 rounded-2xl p-7"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={13} className="fill-white text-white" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-5">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
