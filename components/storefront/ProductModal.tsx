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
  isDark: boolean;
}

function isOutOfStock(product: Product): boolean {
  return product.quantity >= 0 && product.quantity === 0;
}

export default function ProductModal({ product, onClose, primaryColor, isDark }: ProductModalProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const outOfStock = isOutOfStock(product);

  function handleAdd() {
    if (outOfStock) return;
    addItem(product);
    toast.success(`${product.name} added to bag`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className={`relative w-full sm:max-w-lg border sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col ${
        isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-black/5"
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors cursor-pointer ${
            isDark ? "bg-black/50 text-white hover:bg-white/10" : "bg-white/80 text-black hover:bg-black/5"
          }`}
        >
          <X size={18} />
        </button>

        {product.image_url && (
          <div className={`relative aspect-square sm:aspect-video w-full shrink-0 ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`}>
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
                <span className="text-xs font-bold uppercase tracking-wider bg-white text-black px-3 py-1 rounded-md shadow-xl">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>{product.name}</h2>
            <p className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-black"}`}>{formatPrice(product.price)}</p>
            {product.quantity >= 0 && product.quantity > 0 && (
              <p className="text-xs text-muted mt-1">{product.quantity} left in stock</p>
            )}
          </div>

          {product.description && (
            <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>{product.description}</p>
          )}

          {outOfStock ? (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}>
              <AlertCircle size={18} className="text-muted shrink-0" />
              <span className="text-sm text-muted">This item is currently out of stock</span>
            </div>
          ) : cartItem ? (
            <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
              <span className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>In your bag</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    cartItem.quantity === 1
                      ? removeItem(product.id)
                      : updateQuantity(product.id, cartItem.quantity - 1)
                  }
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-black/5 hover:bg-black/10 text-black"
                  }`}
                >
                  <Minus size={14} />
                </button>
                <span className={`font-semibold w-6 text-center ${isDark ? "text-white" : "text-black"}`}>{cartItem.quantity}</span>
                <button
                  onClick={() => {
                    if (product.quantity >= 0 && cartItem.quantity >= product.quantity) {
                      toast.error("Maximum stock reached");
                      return;
                    }
                    updateQuantity(product.id, cartItem.quantity + 1);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-black/5 hover:bg-black/10 text-black"
                  }`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleAdd} 
              className="w-full h-12 text-black font-bold uppercase tracking-widest text-xs shadow-xl" 
              style={{ backgroundColor: primaryColor || '#ffffff' }}
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
