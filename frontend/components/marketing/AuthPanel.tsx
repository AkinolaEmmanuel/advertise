import { ArrowRight, MessageCircle } from "lucide-react";
import PolowoLogo from "@/components/brand/PolowoLogo";
import StorefrontMockup from "@/components/marketing/StorefrontMockup";
import TrustBadges from "@/components/marketing/TrustBadges";

export default function AuthPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 rounded-2xl border border-border bg-surface min-h-[560px]">
      <div>
        <PolowoLogo href="/" size="lg" />
        <h1 className="font-display text-3xl xl:text-4xl font-bold text-foreground mt-10 leading-tight">
          Your free storefront for WhatsApp sales
        </h1>
        <p className="text-muted mt-4 text-base leading-relaxed max-w-md">
          Unlimited products. One link. Orders via WhatsApp or bank transfer — built for Nigerian
          sellers.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-foreground/90">
          <li className="flex items-center gap-2">
            <MessageCircle size={16} className="text-accent shrink-0" />
            WhatsApp checkout with order logging
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight size={16} className="text-accent shrink-0" />
            Live in under 60 seconds
          </li>
        </ul>
      </div>
      <div className="mt-8 scale-90 origin-bottom-left xl:scale-95">
        <StorefrontMockup />
      </div>
      <div className="mt-8">
        <TrustBadges />
      </div>
    </div>
  );
}
