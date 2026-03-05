"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { generateSlug } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!brandName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      const slug = generateSlug(brandName);
      const { error: brandError } = await supabase.from("brands").insert({
        user_id: data.user.id,
        name: brandName.trim(),
        slug,
      });

      if (brandError) {
        if (brandError.code === "23505") {
          const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
          await supabase.from("brands").insert({
            user_id: data.user.id,
            name: brandName.trim(),
            slug: uniqueSlug,
          });
        } else {
          toast.error("Failed to create your brand. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      fetch("/api/mail/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, brandName: brandName.trim() }),
      }).catch(() => {});

      toast.success("Account created! Welcome to Advertise.");
      router.push("/dashboard");
    }

    setIsLoading(false);
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create your billboard</h2>
        <p className="text-muted mt-1.5 text-sm">Start showcasing your products in 60 seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="brand-name"
          label="Brand Name"
          type="text"
          placeholder="My Awesome Brand"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

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
