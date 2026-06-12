"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { user } = await getCurrentUser();
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [];
        if (!adminEmails.includes(user.email)) {
          router.push("/dashboard");
          return;
        }
        setAuthorized(true);
      } catch {
        router.push("/login");
      }
    }

    checkAdmin();
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
