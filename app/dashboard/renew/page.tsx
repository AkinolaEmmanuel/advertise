"use client";

import Link from "next/link";
import { AlertCircle, CreditCard, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function RenewPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-danger/20 rounded-3xl p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto text-danger">
          <AlertCircle size={40} />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Subscription Expired</h1>
          <p className="text-muted mt-2">
            Your access to the pòlówó dashboard and your public storefront has been restricted. 
            Renew your subscription to continue showcasing your products.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
            <h3 className="font-bold text-white text-sm">Standard Plan — ₦2,500/mo</h3>
            <ul className="text-[10px] text-muted space-y-1 mt-2">
              <li>• Unlimited Products</li>
              <li>• Verified Badge (Optional)</li>
              <li>• Custom Themes</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard/settings" className="w-full">
            <Button className="w-full bg-white text-black hover:bg-neutral-200" size="lg">
              <CreditCard size={18} className="mr-2" />
              Pay with Card
            </Button>
          </Link>
          
          <a href="https://wa.me/2347047548793" target="_blank" className="w-full">
            <Button variant="secondary" className="w-full border-white/5 text-muted hover:text-white" size="lg">
              <MessageCircle size={18} className="mr-2" />
              Pay via Transfer
            </Button>
          </a>
        </div>
        
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Secure Payments by Paystack
        </p>
      </div>
    </div>
  );
}
