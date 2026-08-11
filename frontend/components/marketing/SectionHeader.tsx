"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 sm:mb-16 max-w-2xl ${alignClass} ${className}`}
    >
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted text-base sm:text-lg leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}
