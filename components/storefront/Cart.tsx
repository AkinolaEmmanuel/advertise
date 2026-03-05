"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { formatPrice, buildWhatsAppUrl } from "@/lib/utils";
import type { Brand } from "@/lib/types";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { X, Minus, Plus, Trash2, MessageCircle, Copy, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { logEvent } from "@/lib/analytics";

// Hardcoded Admin Account for Platform Upgrades is handled in SettingsPage.
// Storefront payments use the seller's specific account provided via props.
interface CartProps {
  brandId: string;
  brandName: string;
  whatsapp?: string;
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
  isDark: boolean;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
}

export default function Cart({ 
  brandId, 
  brandName, 
  whatsapp, 
  isOpen, 
  onClose, 
  primaryColor, 
  isDark,
  bankName,
  accountNumber,
  accountName
}: CartProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  async function logOrder() {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    
    setIsLogging(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("orders").insert({
        brand_id: brandId,
        customer_name: customerName,
        customer_phone: customerPhone,
        total_amount: getTotal(),
        items: items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }))
      });

      if (error) console.error("Order logging error:", error);
      return true;
    } catch (err) {
      console.error("Order logging failed:", err);
      return true; // Still allow checkout even if logging fails
    } finally {
      setIsLogging(false);
    }
  }

  async function handleWhatsAppCheckout() {
    if (!whatsapp) return;
    const ok = await logOrder();
    if (!ok) return;

    const cartItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const url = buildWhatsAppUrl(whatsapp, brandName, cartItems, {
      name: customerName,
      phone: customerPhone
    });

    logEvent(brandId, 'whatsapp_click', undefined, { 
      total: getTotal(),
      customerName,
      customerPhone
    });

    window.open(url, "_blank");
  }

  function handleCopyAccount() {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSendReceipt() {
    const ok = await logOrder();
    if (!ok) return;

    const orderSummary = items
      .map((item) => `• ${item.product.name} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`)
      .join("\n");

    const message = encodeURIComponent(
      `📋 *Payment Receipt*\n\n` +
      `*Store:* ${brandName}\n` +
      `*Customer:* ${customerName}\n` +
      `*Items:*\n${orderSummary}\n\n` +
      `*Total:* ${formatPrice(getTotal())}\n\n` +
      `I have made payment. Please confirm.`
    );

    logEvent(brandId, 'transfer_click', undefined, {
      type: 'receipt_send',
      total: getTotal(),
      customerName,
      customerPhone
    });

    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 border-l z-50 flex flex-col transition-transform duration-500 shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"}`}
      >
        <div className={`flex items-center justify-between px-6 py-5 border-b shrink-0 ${isDark ? "border-white/5" : "border-black/5"}`}>
          <h2 className={`text-lg font-bold flex items-center gap-2 uppercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            {showPayment ? (
              <button
                onClick={() => setShowPayment(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <ShoppingBag size={18} />
            )}
            {showPayment ? "Transfer" : "My Bag"}
            {!showPayment && items.length > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"}`}>{items.length}</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? "text-muted hover:text-white hover:bg-white/5" : "text-muted hover:text-black hover:bg-black/5"}`}
          >
            <X size={20} />
          </button>
        </div>

        {showPayment ? (
          <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
            <div className="space-y-6 flex-1">
              <div className="text-center">
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}>{formatPrice(getTotal())}</p>
                <p className="text-xs text-muted mt-1 uppercase tracking-widest font-bold">Transfer Exact Amount</p>
              </div>

              <div className={`border rounded-2xl p-5 space-y-4 shadow-sm ${isDark ? "bg-white/5 border-white/5" : "bg-black/[0.02] border-black/5"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Bank</span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>{bankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Account Name</span>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>{accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold font-mono ${isDark ? "text-white" : "text-black"}`}>{accountNumber}</span>
                    <button
                      onClick={handleCopyAccount}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"}`}
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className={isDark ? "text-white" : "text-black"} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`border rounded-2xl p-5 ${isDark ? "bg-white/5 border-white/5" : "bg-black/[0.02] border-black/5"}`}>
                <p className="text-[10px] text-muted mb-3 uppercase tracking-widest font-bold">Order Details</p>
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-1.5">
                    <span className={`text-sm truncate flex-1 ${isDark ? "text-white" : "text-black"}`}>
                      {item.product.name} <span className="text-muted text-xs">×{item.quantity}</span>
                    </span>
                    <span className={`text-sm font-bold ml-2 ${isDark ? "text-white" : "text-black"}`}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className={`border-t mt-3 pt-3 flex items-center justify-between ${isDark ? "border-white/5" : "border-black/5"}`}>
                  <span className={`text-sm font-bold uppercase ${isDark ? "text-white/60" : "text-black/60"}`}>Total</span>
                  <span className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Button onClick={handleSendReceipt} className="w-full" size="lg">
                <MessageCircle size={18} />
                Send Receipt & Confirm
              </Button>
              <p className="text-[10px] text-muted text-center">
                After transferring, tap above to send your receipt via WhatsApp
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
              <ShoppingBag size={32} className="text-muted" />
            </div>
            <h3 className={`font-bold text-xl mb-2 ${isDark ? "text-white" : "text-black"}`}>Your bag is empty</h3>
            <p className="text-sm text-muted max-w-[200px] leading-relaxed">Browse the pòlówó and add items you love</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 animate-fade-in group">
                  <div className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border ${isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"}`}>
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <h4 className={`text-sm font-bold truncate ${isDark ? "text-white/80" : "text-black/80"}`}>{item.product.name}</h4>
                    <p className={`text-base font-bold mt-0.5 ${isDark ? "text-white" : "text-black"}`}>{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.product.id)
                            : updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"}`}
                      >
                        <Minus size={14} className={isDark ? "text-white" : "text-black"} />
                      </button>
                      <span className={`text-sm font-bold w-6 text-center ${isDark ? "text-white" : "text-black"}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"}`}
                      >
                        <Plus size={14} className={isDark ? "text-white" : "text-black"} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 rounded-xl text-muted hover:text-danger hover:bg-danger/10 transition-all self-start cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className={`border-t px-6 py-8 space-y-6 shrink-0 ${isDark ? "bg-black/20 border-white/5" : "bg-neutral-50 border-black/5"}`}>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Billing Info</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 transition-all ${
                        isDark ? "bg-white/5 border-white/5 text-white focus:ring-white/20" : "bg-white border-black/5 text-black focus:ring-black/10 shadow-sm"
                    }`}
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 transition-all ${
                        isDark ? "bg-white/5 border-white/5 text-white focus:ring-white/20" : "bg-white border-black/5 text-black focus:ring-black/10 shadow-sm"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted font-bold text-xs uppercase tracking-wider text-muted">Subtotal</span>
                <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>{formatPrice(getTotal())}</span>
              </div>

              <div className="space-y-3 pt-2">
                {whatsapp && (
                  <Button 
                    onClick={handleWhatsAppCheckout} 
                    className="w-full h-14 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-transform active:scale-95" 
                    style={{ backgroundColor: primaryColor || '#ffffff' }}
                    isLoading={isLogging}
                  >
                    <MessageCircle size={20} />
                    Message to Buy
                  </Button>
                )}

                {bankName && accountNumber && (
                  <Button
                    variant="secondary"
                    className={`w-full h-14 border font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-sm ${
                        isDark ? "bg-white/5 border-white/5 text-white hover:bg-white/10" : "bg-white border-black/5 text-black hover:bg-neutral-50 shadow-sm"
                    }`}
                    onClick={() => {
                      setShowPayment(true);
                      logEvent(brandId, 'transfer_click', undefined, { 
                        type: 'view_details',
                        total: getTotal(),
                        customerName,
                        customerPhone
                      });
                    }}
                  >
                    Pay via Transfer
                  </Button>
                )}
              </div>

              <button
                onClick={clearCart}
                className="text-[10px] text-muted font-bold uppercase tracking-widest hover:text-danger hover:underline transition-colors w-full text-center cursor-pointer"
              >
                Reset My Bag
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
