import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-8 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
