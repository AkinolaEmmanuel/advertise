"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
import { useDashboard } from "../layout";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Upload, MessageCircle, Crown, Sparkles, Copy, Check, Palette, Moon, Landmark, Globe } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const PAYMENT_ACCOUNT = {
  bank: "Opay",
  accountNumber: "7047548793",
  accountName: "Emmanuel Akinola",
  confirmWhatsApp: "2347047548793",
};

const PLANS = [
  {
    key: "standard",
    name: "Standard",
    price: "₦2,500",
    amount: "₦2,500",
    features: ["Unlimited products", "WhatsApp checkout", "Custom URL", "Mobile storefront"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "₦5,000",
    amount: "₦5,000",
    features: ["Everything in Standard", "Paystack payments", "Analytics dashboard", "Priority support"],
  },
];

export default function SettingsPage() {
  const { brand, setBrand } = useDashboard();
  const [name, setName] = useState(brand.name);
  const [bio, setBio] = useState(brand.bio ?? "");
  const [whatsapp, setWhatsapp] = useState(brand.whatsapp ?? "");
  const [instagram, setInstagram] = useState(brand.instagram ?? "");
  const [telegram, setTelegram] = useState(brand.telegram ?? "");
  const [logoUrl, setLogoUrl] = useState(brand.logo_url ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Bank Info states
  const [bankName, setBankName] = useState(brand.bank_name ?? "");
  const [accountNumber, setAccountNumber] = useState(brand.account_number ?? "");
  const [accountName, setAccountName] = useState(brand.account_name ?? "");
  
  const [slug, setSlug] = useState(brand.slug);
  const [slugError, setSlugError] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const RESERVED_SLUGS = [
    "admin", "login", "signup", "dashboard", "api", "auth", "settings",
    "products", "orders", "analytics", "preview", "explore", "brands",
    "renew", "legal", "terms", "privacy", "help", "support"
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Payment successful! Your plan has been upgraded.");
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, [searchParams]);

  function getTrialDaysRemaining(): number {
    if (!brand.trial_ends_at) return 0;
    const diff = new Date(brand.trial_ends_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  function handleCopyAccount() {
    navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendReceipt(planKey: string) {
    const plan = PLANS.find((p) => p.key === planKey);
    if (!plan) return;

    const message = encodeURIComponent(
      `📋 *Subscription Payment*\n\n` +
      `*Brand:* ${brand.name}\n` +
      `*Plan:* ${plan.name} (${plan.amount}/month)\n\n` +
      `I have made payment. Please confirm and activate my subscription.`
    );

    window.open(`https://wa.me/${PAYMENT_ACCOUNT.confirmWhatsApp}?text=${message}`, "_blank");
  }

  /* --- PAYSTACK UPGRADE (uncomment when ready) ---
  async function handleUpgrade(planKey: string) {
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, type: "subscription" }),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error || "Failed to initiate payment"); return; }
      window.location.href = result.authorization_url;
    } catch { toast.error("Something went wrong"); }
  }
  --- END PAYSTACK --- */

  async function handleLogoUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `logos/${brand.id}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast.error("Failed to upload logo");
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setLogoUrl(urlData.publicUrl);
    setIsUploading(false);
  }

  const [themeSettings, setThemeSettings] = useState(brand.theme_settings ?? {
    theme: "light",
    primaryColor: "#000000",
    fontFamily: "Inter"
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
    if (RESERVED_SLUGS.includes(cleanSlug)) {
      toast.error("This URL is reserved for platform use");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    // Check if slug is taken by someone else
    if (cleanSlug !== brand.slug) {
      const { data: existing } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", cleanSlug)
        .maybeSingle();
      
      if (existing) {
        toast.error("This URL is already taken");
        setIsLoading(false);
        return;
      }
    }

    const { data, error } = await supabase
      .from("brands")
      .update({
        name: name.trim(),
        bio: bio.trim() || null,
        logo_url: logoUrl || null,
        whatsapp: whatsapp.trim() || null,
        instagram: instagram.trim() || null,
        telegram: telegram.trim() || null,
        theme_settings: themeSettings,
        bank_name: bankName.trim() || null,
        account_number: accountNumber.trim() || null,
        account_name: accountName.trim() || null,
        slug: cleanSlug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", brand.id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update settings");
    } else if (data) {
      setBrand(data);
      toast.success("Settings updated!");
    }

    setIsLoading(false);
  }

  const daysLeft = getTrialDaysRemaining();

  return (
    <div className="max-w-2xl space-y-12 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-1 text-sm">Customize your brand and pòlówó appearance</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-white" />
          <h2 className="text-lg font-semibold text-foreground">Storefront Customization</h2>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Theme Mode</label>
              <div className="flex bg-white/5 p-1 rounded-xl gap-1">
                <button 
                  type="button"
                  onClick={() => setThemeSettings({ ...themeSettings, theme: "light" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    themeSettings.theme === 'light' ? 'bg-white text-black' : 'text-muted hover:text-white'
                  }`}
                >
                  <Sparkles size={14} /> Light
                </button>
                <button 
                  type="button"
                  onClick={() => setThemeSettings({ ...themeSettings, theme: "dark" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    themeSettings.theme === 'dark' ? 'bg-white text-black' : 'text-muted hover:text-white'
                  }`}
                >
                  <Moon size={14} /> Dark
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={themeSettings.primaryColor}
                  onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer overflow-hidden"
                />
                <span className="text-sm font-mono text-muted uppercase">{themeSettings.primaryColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-muted uppercase tracking-wider">Typography</label>
             <select 
               value={themeSettings.fontFamily}
               onChange={(e) => setThemeSettings({ ...themeSettings, fontFamily: e.target.value })}
               className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
             >
               <option value="Inter" className="bg-[#111] text-white">Modern (Inter)</option>
               <option value="Outfit" className="bg-[#111] text-white">Clean (Outfit)</option>
               <option value="Playfair Display" className="bg-[#111] text-white">Elegant (Playfair Display)</option>
               <option value="Space Grotesk" className="bg-[#111] text-white">Futuristic (Space Grotesk)</option>
             </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-white" />
          <h2 className="text-lg font-semibold text-foreground">Subscription</h2>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-foreground capitalize">
                {brand.subscription_status === "trial" ? "Free Trial" : brand.subscription_status}
              </p>
              {brand.subscription_status === "trial" && daysLeft > 0 && (
                <p className="text-xs text-muted mt-0.5">
                  {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
                </p>
              )}
              {brand.subscription_status === "trial" && daysLeft === 0 && (
                <p className="text-xs text-danger mt-0.5">Trial expired</p>
              )}
              {brand.subscription_status === "active" && (
                <p className="text-xs text-success mt-0.5">Active</p>
              )}
            </div>
            {brand.subscription_status === "active" && (
              <span className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-full font-medium">
                <Sparkles size={12} className="inline mr-1" />
                Active
              </span>
            )}
          </div>

          {brand.subscription_status !== "active" && !selectedPlan && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                >
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  <p className="text-lg font-bold text-white mt-1">
                    {plan.price}<span className="text-xs text-muted font-normal">/month</span>
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                        <span className="text-white mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setSelectedPlan(plan.key)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    Upgrade to {plan.name}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {selectedPlan && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted">
                  Upgrading to <span className="text-white font-medium">{PLANS.find((p) => p.key === selectedPlan)?.name}</span>
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {PLANS.find((p) => p.key === selectedPlan)?.amount}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted uppercase tracking-wider">Bank</span>
                  <span className="text-sm font-medium text-white">{PAYMENT_ACCOUNT.bank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted uppercase tracking-wider">Account Name</span>
                  <span className="text-sm font-medium text-white">{PAYMENT_ACCOUNT.accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted uppercase tracking-wider">Account No.</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{PAYMENT_ACCOUNT.accountNumber}</span>
                    <button
                      onClick={handleCopyAccount}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSendReceipt(selectedPlan)} className="w-full" size="lg">
                <MessageCircle size={18} />
                Send Receipt & Confirm
              </Button>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-xs text-muted hover:text-white transition-colors w-full text-center cursor-pointer"
              >
                ← Back to plans
              </button>
            </div>
          )}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Brand Profile</h2>

          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl bg-surface-hover border-2 border-dashed border-white/10 hover:border-white/30 transition-colors cursor-pointer overflow-hidden shrink-0 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
              ) : isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : (
                <Upload size={20} className="text-muted" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Brand Logo</p>
              <p className="text-xs text-muted">Click to upload. Square image recommended.</p>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-xs text-danger hover:underline mt-1 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
              }}
            />
          </div>

          <Input
            id="brand-name"
            label="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <Globe size={14} />
              pòlówó URL
            </label>
            <div className={`flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12 transition-all focus-within:border-white/20`}>
              <span className="text-muted text-sm shrink-0 select-none">polowo.app/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setSlug(val);
                }}
                className="w-full bg-transparent border-none outline-none text-sm text-white"
                placeholder="your-brand"
              />
            </div>
            <p className="text-[10px] text-muted">A unique URL for your customers to access your storefront.</p>
          </div>

          <Textarea
            id="brand-bio"
            label="Bio"
            placeholder="Tell customers about your brand..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageCircle size={18} />
              Checkout Channels
            </h2>
            <p className="text-sm text-muted mt-1">Customers will use these to place orders via DM</p>
          </div>

          <Input
            id="whatsapp"
            label="WhatsApp Number"
            placeholder="e.g. 2348012345678"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <Input
            id="instagram"
            label="Instagram Handle"
            placeholder="e.g. mybrand"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />

          <Input
            id="telegram"
            label="Telegram Username"
            placeholder="e.g. mybrand"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Landmark size={18} />
              Payment Details
            </h2>
            <p className="text-sm text-muted mt-1">Provide your bank account details for direct transfers from customers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="bank-name"
              label="Bank Name"
              placeholder="e.g. Zenith Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <Input
              id="account-number"
              label="Account Number"
              placeholder="10-digit number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              maxLength={10}
            />
          </div>
          <Input
            id="account-name"
            label="Account Name"
            placeholder="Name displayed on your bank account"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </section>

        <Button type="submit" isLoading={isLoading} size="lg">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
