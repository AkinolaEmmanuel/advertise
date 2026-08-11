"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cart";
import Button from "@/components/ui/Button";
import { ShoppingBag, X, Minus, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  primaryColor?: string;
}

function isOutOfStock(product: Product): boolean {
  return product.quantity >= 0 && product.quantity === 0;
}

export default function ProductModal({ product, onClose, primaryColor }: ProductModalProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const outOfStock = isOutOfStock(product);

  function handleAdd() {
    if (outOfStock) return;
    if (!addItem(product)) {
      toast.error("Maximum stock reached");
      return;
    }
    toast.success(`${product.name} added to bag`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg border border-border bg-surface sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-primary-soft transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {product.image_url && (
          <div className="relative aspect-square sm:aspect-video w-full shrink-0 bg-surface-hover">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"} ${outOfStock ? "grayscale" : ""}`}
              sizes="(max-width: 640px) 100vw, 512px"
              onLoad={() => setImageLoaded(true)}
              priority
            />
            {outOfStock && (
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-md shadow-xl">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
            <p className="text-2xl font-bold mt-1 text-foreground">{formatPrice(product.price)}</p>
            {product.quantity >= 0 && product.quantity > 0 && (
              <p className="text-xs text-muted mt-1">{product.quantity} left in stock</p>
            )}
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-muted">{product.description}</p>
          )}

          {outOfStock ? (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-border bg-primary-soft">
              <AlertCircle size={18} className="text-muted shrink-0" />
              <span className="text-sm text-muted">This item is currently out of stock</span>
            </div>
          ) : cartItem ? (
            <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-primary-soft">
              <span className="text-sm font-medium text-foreground">In your bag</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    cartItem.quantity === 1
                      ? removeItem(product.id)
                      : updateQuantity(product.id, cartItem.quantity - 1)
                  }
                  className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-foreground transition-colors cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="font-semibold w-6 text-center text-foreground">{cartItem.quantity}</span>
                <button
                  onClick={() => {
                    if (product.quantity >= 0 && cartItem.quantity >= product.quantity) {
                      toast.error("Maximum stock reached");
                      return;
                    }
                    if (!updateQuantity(product.id, cartItem.quantity + 1)) {
                      toast.error("Maximum stock reached");
                    }
                  }}
                  className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-foreground transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleAdd}
              className="w-full h-12 font-bold uppercase tracking-widest text-xs shadow-xl text-primary-foreground"
              style={{ backgroundColor: primaryColor || undefined }}
              size="lg"
            >
              <ShoppingBag size={18} />
              Add to Bag
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
