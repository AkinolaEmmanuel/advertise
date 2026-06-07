"use client";

import { useState, type FormEvent } from "react";
import { useDashboard } from "../layout";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { MessageCircle, Sparkles, Check, Palette, Moon, Landmark, Globe } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Brand } from "@/lib/types";
import ImageUploader from "@/components/dashboard/ImageUploader";
import { isReservedSlug } from "@/lib/slug";
import { validateCheckoutContactInput } from "@/lib/checkout-contact";
import { FREE_PLATFORM_FEATURES } from "@/lib/platform";

export default function SettingsPage() {
  const { brand, setBrand } = useDashboard();
  const [name, setName] = useState(brand.name);
  const [bio, setBio] = useState(brand.bio ?? "");
  const [whatsapp, setWhatsapp] = useState(brand.whatsapp ?? "");
  const [instagram, setInstagram] = useState(brand.instagram ?? "");
  const [telegram, setTelegram] = useState(brand.telegram ?? "");
  const [logoUrl, setLogoUrl] = useState(brand.logo_url ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const [bankName, setBankName] = useState(brand.bank_name ?? "");
  const [accountNumber, setAccountNumber] = useState(brand.account_number ?? "");
  const [accountName, setAccountName] = useState(brand.account_name ?? "");
  
  const [slug, setSlug] = useState(brand.slug);
  const [contactError, setContactError] = useState("");

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
    if (isReservedSlug(cleanSlug)) {
      toast.error("This URL is reserved for platform use");
      return;
    }

    const contactCheck = validateCheckoutContactInput(whatsapp, accountNumber);
    if (!contactCheck.ok) {
      setContactError(contactCheck.message);
      toast.error(contactCheck.message);
      return;
    }
    setContactError("");

    setIsLoading(true);

    try {
      const data = await apiFetch<Brand>("/api/dashboard/brand", {
        method: "PATCH",
        body: JSON.stringify({
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
        }),
      });
      setBrand(data);
      toast.success("Settings updated!");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    }

    setIsLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-12 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-1 text-sm">Customize your brand and storefront appearance</p>
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
          <Sparkles size={18} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-foreground">Your plan</h2>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <p className="font-semibold text-white text-lg">Free forever</p>
          <p className="text-sm text-muted mt-1">
            pòlówó charges no monthly fee. Focus on selling — not subscriptions.
          </p>
          <ul className="mt-4 space-y-2">
            {FREE_PLATFORM_FEATURES.map((feature) => (
              <li key={feature} className="text-xs text-muted flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Brand Profile</h2>

          <ImageUploader
            value={logoUrl}
            onChange={setLogoUrl}
            purpose="brand_logo"
            label="Brand Logo"
            helpText="Square image recommended. Max 5 MB."
            variant="square"
            alt={`${name || "Brand"} logo preview`}
          />

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
              Storefront URL
            </label>
            <div className={`flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12 transition-all focus-within:border-white/20`}>
              <span className="text-muted text-sm shrink-0 select-none">polowo.live/</span>
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
            <p className="text-sm text-muted mt-1">
              At least one is required: WhatsApp <span className="text-white/80">or</span> bank account number below
            </p>
          </div>

          {contactError && (
            <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-3">
              {contactError}
            </p>
          )}

          <Input
            id="whatsapp"
            label="WhatsApp Number"
            placeholder="e.g. 2348012345678"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              if (contactError) setContactError("");
            }}
            inputMode="numeric"
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
            <p className="text-sm text-muted mt-1">
              Account number counts toward checkout if WhatsApp is not set. Add bank name for transfer payments.
            </p>
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
              onChange={(e) => {
                setAccountNumber(e.target.value);
                if (contactError) setContactError("");
              }}
              inputMode="numeric"
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
