import { Building2, CreditCard, Instagram, MessageCircle } from "lucide-react";

const integrations = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Building2, label: "Bank transfer" },
  { icon: CreditCard, label: "Paystack", badge: "Soon" },
  { icon: Instagram, label: "Instagram" },
];

export default function IntegrationStrip() {
  return (
    <section className="py-10 border-y border-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted mb-6">
          Works with tools you already use
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {integrations.map((item) => (
            <div
              key={item.label}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-muted"
            >
              <item.icon size={18} className="text-foreground/70" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
