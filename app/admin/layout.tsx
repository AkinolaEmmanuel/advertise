import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
  if (!adminEmails.includes(user.email || "")) {
    console.log(`Admin Layout: ${user.email} denied access to /admin`);
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
