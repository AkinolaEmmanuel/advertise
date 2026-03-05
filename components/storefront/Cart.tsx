"use client";

import { useCartStore } from "@/stores/cart";
import { formatPrice, buildWhatsAppUrl } from "@/lib/utils";
import type { Brand } from "@/lib/types";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { X, Minus, Plus, Trash2, MessageCircle, CreditCard, ShoppingBag } from "lucide-react";

interface CartProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ brand, isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  function handleWhatsAppCheckout() {
    if (!brand.whatsapp) return;

    const cartItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const url = buildWhatsAppUrl(brand.whatsapp, brand.name, cartItems);
    window.open(url, "_blank");
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-surface border-l border-border z-50 flex flex-col ${
          isOpen ? "animate-slide-in-right" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag size={18} />
            Your Bag
            {items.length > 0 && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{items.length}</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-muted" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Your bag is empty</h3>
            <p className="text-sm text-muted">Browse the billboard and add items you love</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 animate-fade-in">
                  <div className="relative w-16 h-16 rounded-xl bg-surface-hover overflow-hidden shrink-0">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <ShoppingBag size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                    <p className="text-sm text-primary font-semibold">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.product.id)
                            : updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 rounded-md bg-surface-hover hover:bg-border transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-md bg-surface-hover hover:bg-border transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors self-start cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-4 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Total</span>
                <span className="text-xl font-bold text-foreground">{formatPrice(getTotal())}</span>
              </div>

              <div className="space-y-2">
                {brand.whatsapp && (
                  <Button onClick={handleWhatsAppCheckout} className="w-full" size="lg">
                    <MessageCircle size={18} />
                    Message to Buy
                  </Button>
                )}

                <Button variant="secondary" className="w-full" size="lg" disabled>
                  <CreditCard size={18} />
                  Pay Now — Coming Soon
                </Button>
              </div>

              <button
                onClick={clearCart}
                className="text-xs text-muted hover:text-danger transition-colors w-full text-center cursor-pointer"
              >
                Clear Bag
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
