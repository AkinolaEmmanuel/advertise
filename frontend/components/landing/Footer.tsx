import Link from "next/link";
import PolowoLogo from "@/components/brand/PolowoLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <PolowoLogo href="/" size="sm" />
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-sm text-muted">
            <Link href="/brands" className="hover:text-foreground transition-colors">
              Explore brands
            </Link>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
        <p className="text-center text-xs text-muted mt-8">
          &copy; {new Date().getFullYear()} pòlówó. Built for Nigerian sellers.
        </p>
      </div>
    </footer>
  );
}
