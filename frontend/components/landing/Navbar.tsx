"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import PolowoLogo from "@/components/brand/PolowoLogo";

const navLinks = [
  { href: "/brands", label: "Explore" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scroll = params.get("scroll");
    if (scroll && pathname === "/") {
      const element = document.getElementById(scroll);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          const url = new URL(window.location.href);
          url.searchParams.delete("scroll");
          window.history.replaceState(null, "", url.pathname);
        }, 100);
      }
    }
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");

      if (pathname === "/") {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/?scroll=${id}`);
      }
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <PolowoLogo href="/" size="md" />

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors px-2"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Get Started
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-primary-soft transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-3 text-sm text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-sm text-center text-muted hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-sm text-center rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
