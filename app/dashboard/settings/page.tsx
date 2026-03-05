"use client";

import { useState, type FormEvent, useRef } from "react";
import { useDashboard } from "../layout";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Upload, X, MessageCircle } from "lucide-react";
import Image from "next/image";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("brands")
      .update({
        name: name.trim(),
        bio: bio.trim() || null,
        logo_url: logoUrl || null,
        whatsapp: whatsapp.trim() || null,
        instagram: instagram.trim() || null,
        telegram: telegram.trim() || null,
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

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-1 text-sm">Customize your brand and checkout options</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Brand Profile</h2>

          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl bg-surface-hover border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden shrink-0 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
              ) : isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
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

        <Button type="submit" isLoading={isLoading} size="lg">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
