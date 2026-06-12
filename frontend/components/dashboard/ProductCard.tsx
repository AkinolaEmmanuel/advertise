"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

function isOutOfStock(product: Product): boolean {
  return product.quantity >= 0 && product.quantity === 0;
}

export default function ProductCard({ product, onToggle, onEdit, onDelete }: ProductCardProps) {
  const outOfStock = isOutOfStock(product);

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 group animate-fade-in">
      <div className="relative aspect-square bg-surface-hover">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <Package size={40} />
          </div>
        )}

        {!product.is_active && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-muted bg-surface/80 px-3 py-1 rounded-full">
              Hidden
            </span>
          </div>
        )}

        {outOfStock && product.is_active && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-danger text-white px-2 py-0.5 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
            {product.quantity >= 0 && (
              <span className={`text-xs font-medium ${outOfStock ? "text-danger" : "text-muted"}`}>
                {outOfStock ? "0 left" : `${product.quantity} left`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={product.is_active}
              onChange={() => onToggle(product.id, !product.is_active)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-hover rounded-full peer peer-checked:bg-white transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white peer-checked:after:bg-black after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            <span className="ml-2 text-xs text-muted">{product.is_active ? "Live" : "Off"}</span>
          </label>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(product)}
              className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Package({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}
