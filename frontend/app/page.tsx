"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import MobileTabBar from "@/components/landing/MobileTabBar";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-white selection:text-black overflow-x-hidden">
      <BackgroundEffects />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CallToAction />
      <Footer />
      <MobileTabBar />
    </div>
  );
}
