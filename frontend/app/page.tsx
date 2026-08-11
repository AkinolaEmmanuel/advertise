"use client";

import Hero from "@/components/landing/Hero";
import IntegrationStrip from "@/components/landing/IntegrationStrip";
import WhatsAppCheckoutDemo from "@/components/landing/WhatsAppCheckoutDemo";
import Features from "@/components/landing/Features";
import MarketplacePreview from "@/components/landing/MarketplacePreview";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import CompetitiveFAQ from "@/components/landing/CompetitiveFAQ";
import CallToAction from "@/components/landing/CallToAction";
import MarketingShell from "@/components/marketing/MarketingShell";

export default function LandingPage() {
  return (
    <MarketingShell>
      <main>
        <Hero />
        <IntegrationStrip />
        <WhatsAppCheckoutDemo />
        <Features />
        <MarketplacePreview />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CompetitiveFAQ />
        <CallToAction />
      </main>
    </MarketingShell>
  );
}
