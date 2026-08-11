"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MobileTabBar from "@/components/landing/MobileTabBar";
import BackgroundEffects from "@/components/landing/BackgroundEffects";

interface MarketingShellProps {
  children: ReactNode;
  showMobileTab?: boolean;
}

export default function MarketingShell({ children, showMobileTab = true }: MarketingShellProps) {
  return (
    <div className="relative min-h-screen marketing-mesh text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <BackgroundEffects />
      <Navbar />
      {children}
      <Footer />
      {showMobileTab && <MobileTabBar />}
    </div>
  );
}
