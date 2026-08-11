import { Shield, MapPin, Sparkles } from "lucide-react";

const badges = [
  { icon: Sparkles, label: "Free forever" },
  { icon: MapPin, label: "Built for Nigeria" },
  { icon: Shield, label: "Secure by default" },
];

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-muted"
        >
          <badge.icon size={14} className="text-accent shrink-0" />
          {badge.label}
        </div>
      ))}
    </div>
  );
}
