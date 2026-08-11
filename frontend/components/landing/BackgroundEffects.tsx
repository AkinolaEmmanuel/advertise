"use client";

import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        animate={{ scale: [1, 1.08, 1], x: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full blur-[100px] opacity-60 dark:opacity-100"
        style={{ background: "var(--mesh-1)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], x: [0, -40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] -right-[5%] w-[35%] h-[35%] rounded-full blur-[90px] opacity-50 dark:opacity-100"
        style={{ background: "var(--mesh-2)" }}
      />
    </div>
  );
}
