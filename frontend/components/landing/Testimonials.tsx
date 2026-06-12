"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amaka O.",
    role: "Fashion Brand Owner",
    text: "I set up my store in 5 minutes and got my first WhatsApp order the same day. This is everything I needed.",
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
    <section className="py-24 sm:py-28 border-t border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight">Loved by small businesses</h2>
          <p className="mt-4 text-muted text-lg">Join hundreds of sellers already in our marketplace</p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-surface border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-colors"
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
                <p className="font-semibold text-white text-sm uppercase tracking-tight">{testimonial.name}</p>
                <p className="text-xs text-muted uppercase tracking-widest">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-surface border border-white/5 rounded-2xl p-7 min-w-[280px] w-[85vw] snap-center shrink-0"
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
                <p className="font-semibold text-white text-sm uppercase tracking-tight">{testimonial.name}</p>
                <p className="text-xs text-muted uppercase tracking-widest">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="md:hidden flex justify-center gap-2 -mt-4 mb-4">
          {testimonials.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  );
}
