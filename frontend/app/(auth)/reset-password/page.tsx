"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      toast.error("Invalid reset link");
      setIsLoading(false);
      return;
    }

    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, token, password }),
      });
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Password reset failed");
    }

    setIsLoading(false);
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground font-display uppercase tracking-tight">New Password</h2>
        <p className="text-muted mt-1.5 text-sm">Enter a new secure password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="password"
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Update Password
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
