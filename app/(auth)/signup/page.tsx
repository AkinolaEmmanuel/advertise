"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Availability state
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [finalSlug, setFinalSlug] = useState("");

  useEffect(() => {
    if (brandName.length < 2) {
      setIsAvailable(null);
      setAvailabilityError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/auth/check-availability?name=${encodeURIComponent(brandName)}`);
        const data = await res.json();
        
        setIsAvailable(data.available);
        setAvailabilityError(data.error || "");
        setFinalSlug(data.slug || "");
      } catch (err) {
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [brandName]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!brandName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isAvailable === false) {
      toast.error(availabilityError || "That name is not available");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          brandName: brandName.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Account created! Welcome aboard.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create your store</h2>
        <p className="text-muted mt-1.5 text-sm">Start showcasing your products in 60 seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Input
            id="brand-name"
            label="Brand Name"
            type="text"
            placeholder="e.g. Vintage Collectibles"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            className={isAvailable === false ? "border-danger focus:ring-danger/20" : isAvailable === true ? "border-green-500 focus:ring-green-500/20" : ""}
          />
          {brandName.length >= 2 && (
            <div className="px-1 flex items-center justify-between min-h-[24px]">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {isChecking ? (
                  <Loader2 size={12} className="animate-spin text-muted" />
                ) : isAvailable === true ? (
                  <CheckCircle2 size={12} className="text-green-500" />
                ) : isAvailable === false ? (
                  <AlertCircle size={12} className="text-danger" />
                ) : null}
                
                <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${
                  isAvailable === false ? "text-danger" : "text-muted"
                }`}>
                  {isChecking ? "Checking..." : 
                   isAvailable === false ? (availabilityError || "Taken") : 
                   isAvailable === true ? `polowo.live/${finalSlug}` : ""}
                </span>
              </div>
            </div>
          )}
        </div>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute bottom-[10px] right-4 text-muted hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
