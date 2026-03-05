import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold tracking-tight text-white">Advertise</span>
          <nav className="flex items-center gap-6 text-sm text-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </nav>
        </div>
        <p className="text-center text-xs text-muted/60 mt-8">
          &copy; {new Date().getFullYear()} Advertise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
