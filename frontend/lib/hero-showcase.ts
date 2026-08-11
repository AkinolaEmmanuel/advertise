export interface HeroProduct {
  name: string;
  price: number;
  image_url: string;
}

export interface HeroShowcase {
  brandName: string;
  brandSlug: string;
  products: HeroProduct[];
}

export const HERO_SHOWCASE: HeroShowcase = {
  brandName: "Lagos Threads",
  brandSlug: "lagos-threads",
  products: [
    {
      name: "Classic Tee",
      price: 8500,
      image_url:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      name: "Graphic Tee",
      price: 12000,
      image_url:
        "https://images.unsplash.com/photo-1583743814966-6a2473026145?w=400&h=400&fit=crop",
    },
    {
      name: "Linen Set",
      price: 15000,
      image_url:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    },
    {
      name: "Crossbody Bag",
      price: 9500,
      image_url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    },
  ],
};

export function brandInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
