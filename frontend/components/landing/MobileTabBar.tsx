"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, Compass, Zap, HelpCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = [
  { icon: Home, label: "Home", href: "/#top", id: "top" },
  { icon: Compass, label: "Explore", href: "/brands", id: "brands" },
  { icon: Zap, label: "Features", href: "/#features", id: "features" },
  { icon: HelpCircle, label: "How", href: "/#how-it-works", id: "how-it-works" },
  { icon: User, label: "Login", href: "/login", id: "login" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) return;
      
      const sections = tabs.filter(t => t.href.startsWith("/#")).map(t => t.id);
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveTab(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent, href: string, id: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "/");
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-3rem)] max-w-sm">
      <nav className="glass py-3 px-5 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between gap-1 overflow-hidden backdrop-blur-3xl">
        {tabs.map((tab) => {
          const isActive = (tab.href === "/brands" && pathname === "/brands") || 
                           (tab.href === "/login" && pathname === "/login") ||
                           (tab.href.startsWith("/#") && pathname === "/" && activeTab === tab.id);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={(e) => handleClick(e, tab.href, tab.id)}
              className="relative flex flex-col items-center gap-1 min-w-[3.5rem] transition-all"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl flex flex-col items-center justify-center transition-colors ${
                  isActive ? "text-white" : "text-muted hover:text-white/60"
                }`}
              >
                <tab.icon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{tab.label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5 rounded-2xl -z-10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
