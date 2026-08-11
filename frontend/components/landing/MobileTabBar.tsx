"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Compass, HelpCircle, Home, Sparkles, User } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", href: "/#top", id: "top" },
  { icon: Compass, label: "Explore", href: "/brands", id: "brands" },
  { icon: Sparkles, label: "Features", href: "/#features", id: "features" },
  { icon: HelpCircle, label: "FAQ", href: "/#faq", id: "faq" },
  { icon: User, label: "Login", href: "/login", id: "login" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768 || pathname !== "/") return;

      const sections = tabs.filter((t) => t.href.startsWith("/#")).map((t) => t.id);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveTab(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent, href: string, id: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      if (pathname !== "/") return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "/");
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md">
      <nav className="glass py-2.5 px-3 rounded-2xl border border-border shadow-xl flex items-center justify-between gap-0.5">
        {tabs.map((tab) => {
          const isActive =
            (tab.href === "/brands" && pathname === "/brands") ||
            (tab.href === "/login" && pathname.startsWith("/login")) ||
            (tab.href.startsWith("/#") && pathname === "/" && activeTab === tab.id);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={(e) => handleClick(e, tab.href, tab.id)}
              className={`relative flex flex-col items-center gap-0.5 min-w-[3rem] py-1.5 px-1 rounded-xl transition-colors ${
                isActive ? "text-foreground bg-primary-soft" : "text-muted"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[9px] font-bold uppercase tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
