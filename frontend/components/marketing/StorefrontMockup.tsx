"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag, BadgeCheck } from "lucide-react";
import { brandInitials, HERO_SHOWCASE } from "@/lib/hero-showcase";
import { formatPrice } from "@/lib/utils";

function ProductTile({ name, price, imageUrl }: { name: string; price: number; imageUrl: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-2.5 space-y-2">
      <div className="aspect-square rounded-lg bg-surface-hover overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 40vw, 180px"
          className="object-cover"
        />
      </div>
      <p className="text-[11px] font-medium text-foreground truncate">{name}</p>
      <p className="text-[11px] font-bold text-foreground">{formatPrice(price)}</p>
    </div>
  );
}

export default function StorefrontMockup() {
  const { brandName, brandSlug, products } = HERO_SHOWCASE;
  const featured = products[0];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-hover">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 text-center text-[10px] text-muted font-mono truncate px-2">
            polowo.live/{brandSlug}
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-bold text-sm shrink-0">
              {brandInitials(brandName)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-display font-bold text-sm text-foreground">{brandName}</p>
                <BadgeCheck size={14} className="text-accent" />
              </div>
              <p className="text-[10px] text-muted uppercase tracking-wider">Fashion · Lagos</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {products.map((item) => (
              <ProductTile
                key={item.name}
                name={item.name}
                price={item.price}
                imageUrl={item.image_url}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="absolute -bottom-4 -right-2 sm:-right-6 w-[52%] max-w-[220px] rounded-2xl border border-border bg-[#075e54] text-white shadow-xl overflow-hidden"
      >
        <div className="px-3 py-2 bg-[#128c7e] flex items-center gap-2">
          <MessageCircle size={14} />
          <span className="text-[11px] font-semibold">WhatsApp Order</span>
        </div>
        <div className="p-3 space-y-2 text-[10px] leading-relaxed">
          <div className="bg-[#dcf8c6] text-[#111] rounded-lg rounded-tr-none p-2 ml-4">
            Hi! I&apos;d like to order:
            <br />
            1× {featured.name} — {formatPrice(featured.price)}
          </div>
          <div className="bg-white/10 rounded-lg rounded-tl-none p-2 mr-2 flex items-center gap-1.5">
            <ShoppingBag size={12} />
            Order logged in dashboard ✓
          </div>
        </div>
      </motion.div>
    </div>
  );
}
