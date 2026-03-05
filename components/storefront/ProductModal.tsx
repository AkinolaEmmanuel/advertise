"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cart";
import Button from "@/components/ui/Button";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleAdd() {
    addItem(product);
    toast.success(`${product.name} added to bag`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-surface border border-border sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full glass text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {product.image_url && (
          <div className="relative aspect-square sm:aspect-video w-full bg-surface-hover shrink-0">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 640px) 100vw, 512px"
              onLoad={() => setImageLoaded(true)}
              priority
            />
          </div>
        )}

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
            <p className="text-2xl font-bold text-primary mt-1">{formatPrice(product.price)}</p>
          </div>

          {product.description && (
            <p className="text-muted text-sm leading-relaxed">{product.description}</p>
          )}

          {cartItem ? (
            <div className="flex items-center justify-between bg-primary/10 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-primary">In your bag</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    cartItem.quantity === 1
                      ? removeItem(product.id)
                      : updateQuantity(product.id, cartItem.quantity - 1)
                  }
                  className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="font-semibold text-foreground w-6 text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : (
            <Button onClick={handleAdd} className="w-full" size="lg">
              <ShoppingBag size={18} />
              Add to Bag
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
