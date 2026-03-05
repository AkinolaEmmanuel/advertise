"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  History, 
  Users, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  TrendingUp,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Brands", icon: Users, href: "/admin/brands" },
    { label: "Growth", icon: TrendingUp, href: "/admin/growth" },
    { label: "Moderation", icon: AlertTriangle, href: "/admin/moderation" },
  ];

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-white">Ad Admin</h1>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg text-muted hover:text-white bg-white/5 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 border-r border-white/5 bg-surface flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2" onClick={closeSidebar}>
            <h1 className="text-xl font-bold tracking-tight text-white">Ad Admin</h1>
          </Link>
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-white bg-white/5 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-black"
                    : "text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-2 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-white/5 hover:text-white transition-all"
          >
            <History size={18} />
            <span className="font-medium text-sm">Seller Dashboard</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all cursor-pointer text-left"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
