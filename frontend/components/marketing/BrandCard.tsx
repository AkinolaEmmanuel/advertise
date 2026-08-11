import Link from "next/link";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { getInitials } from "@/lib/utils";

export interface BrandCardData {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  bio?: string | null;
  is_verified?: boolean;
}

interface BrandCardProps {
  brand: BrandCardData;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/${brand.slug}`}
      className="group block rounded-2xl border border-border bg-surface p-5 hover:border-accent/30 hover:bg-surface-hover transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-bold text-sm shrink-0 overflow-hidden">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
          ) : (
            getInitials(brand.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-semibold text-foreground truncate group-hover:text-accent transition-colors">
              {brand.name}
            </h3>
            {brand.is_verified && <BadgeCheck size={16} className="text-accent shrink-0" />}
          </div>
          <p className="text-xs text-muted font-mono mt-0.5 truncate">/{brand.slug}</p>
          {brand.bio && (
            <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">{brand.bio}</p>
          )}
        </div>
        <ExternalLink
          size={16}
          className="text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
        />
      </div>
    </Link>
  );
}
