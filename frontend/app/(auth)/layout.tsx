import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import PolowoLogo from "@/components/brand/PolowoLogo";
import AuthPanel from "@/components/marketing/AuthPanel";
import BackgroundEffects from "@/components/landing/BackgroundEffects";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen marketing-mesh text-foreground">
      <BackgroundEffects />
      <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <AuthPanel />
          <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
            <div className="lg:hidden flex justify-center mb-6">
              <PolowoLogo href="/" size="md" />
            </div>
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg shadow-black/5 dark:shadow-black/20 animate-fade-in">
              {children}
            </div>
            <p className="text-center text-xs text-muted mt-4 lg:hidden">
              Free forever — no credit card needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
