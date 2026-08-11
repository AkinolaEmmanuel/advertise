"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Eye, LogOut, ShoppingCart, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import PolowoLogo from "@/components/brand/PolowoLogo";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/preview", label: "Preview", icon: Eye },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-border">
        <PolowoLogo href="/" size="sm" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:text-foreground hover:bg-primary-soft"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
