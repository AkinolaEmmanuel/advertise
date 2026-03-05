import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold tracking-tight text-white">Advertise</h1>
          </Link>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-8 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
