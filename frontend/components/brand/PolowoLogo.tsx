import Link from "next/link";

const SIZES = {
  sm: { mark: 22, gap: "gap-2", text: "text-base" },
  md: { mark: 28, gap: "gap-2.5", text: "text-xl" },
  lg: { mark: 36, gap: "gap-3", text: "text-2xl" },
} as const;

type PolowoLogoProps = {
  variant?: "full" | "mark";
  size?: keyof typeof SIZES;
  className?: string;
  href?: string;
};

export function PolowoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="8" className="fill-accent" />
      <path
        d="M9 23V15M23 23V15M8 15H24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 15C8 11.5 11.5 9 16 9C20.5 9 24 11.5 24 15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="20" r="1.75" fill="white" />
    </svg>
  );
}

export default function PolowoLogo({
  variant = "full",
  size = "md",
  className = "",
  href,
}: PolowoLogoProps) {
  const { mark, gap, text } = SIZES[size];

  const content = (
    <span className={`inline-flex items-center ${gap} ${className}`}>
      <PolowoMark size={mark} />
      {variant === "full" && (
        <span className={`font-display font-bold tracking-tight text-foreground ${text}`}>
          pòlówó
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
