"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { formatPrice, buildWhatsAppUrl } from "@/lib/utils";
import { canIncreaseQuantity } from "@/lib/stock";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { X, Minus, Plus, Trash2, MessageCircle, Copy, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import toast from "react-hot-toast";
import { logEvent } from "@/lib/analytics";
import { publicApiFetch } from "@/lib/api";

interface CartProps {
  brandId: string;
  brandName: string;
  whatsapp?: string;
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  checkoutReady?: boolean;
}

export default function Cart({
  brandId,
  brandName,
  whatsapp,
  isOpen,
  onClose,
  primaryColor,
  bankName,
  accountNumber,
  accountName,
  checkoutReady = true,
}: CartProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  function handleClose() {
    setShowPayment(false);
    onClose();
  }

  async function logOrder(): Promise<boolean> {
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    if (items.length === 0) {
      toast.error("Your bag is empty");
      return false;
    }

    setIsLogging(true);
    try {
      await publicApiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: brandId,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim() || null,
          total_amount: getTotal(),
          items: items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });
      return true;
    } catch (err) {
      console.error("Order logging failed:", err);
      toast.error("Could not save your order. Please try again.");
      return false;
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
      phone: customerPhone,
    });

    logEvent(brandId, "whatsapp_click", undefined, {
      total: getTotal(),
      customerName,
      customerPhone,
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
    if (!whatsapp) {
      toast.error("This store has no WhatsApp number for receipts. Message the seller another way.");
      return;
    }

    const ok = await logOrder();
    if (!ok) return;

    const orderSummary = items
      .map(
        (item) =>
          `• ${item.product.name} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`
      )
      .join("\n");

    const message = encodeURIComponent(
      `📋 *Payment Receipt*\n\n` +
        `*Store:* ${brandName}\n` +
        `*Customer:* ${customerName}\n` +
        `*Items:*\n${orderSummary}\n\n` +
        `*Total:* ${formatPrice(getTotal())}\n\n` +
        `I have made payment. Please confirm.`
    );

    logEvent(brandId, "transfer_click", undefined, {
      type: "receipt_send",
      total: getTotal(),
      customerName,
      customerPhone,
    });

    const cleanPhone = whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  }

  function handleIncreaseQuantity(productId: string, currentQty: number) {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;
    if (!canIncreaseQuantity(item.product, currentQty)) {
      toast.error("Maximum stock reached");
      return;
    }
    if (!updateQuantity(productId, currentQty + 1)) {
      toast.error("Maximum stock reached");
    }
  }

  const canSendReceipt = Boolean(whatsapp);
  const canTransfer = Boolean(accountNumber?.trim());
  const canCheckout = checkoutReady && (Boolean(whatsapp) || canTransfer);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-overlay backdrop-blur-sm z-40 animate-fade-in" onClick={handleClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 border-l border-border bg-surface z-50 flex flex-col transition-transform duration-500 shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tight text-foreground">
            {showPayment ? (
              <button
                onClick={() => setShowPayment(false)}
                className="p-1.5 rounded-lg hover:bg-primary-soft transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <ShoppingBag size={18} />
            )}
            {showPayment ? "Transfer" : "My Bag"}
            {!showPayment && items.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-foreground">
                {items.length}
              </span>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-primary-soft transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {showPayment ? (
          <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
            <div className="space-y-6 flex-1">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{formatPrice(getTotal())}</p>
                <p className="text-xs text-muted mt-1 uppercase tracking-widest font-bold">
                  Transfer Exact Amount
                </p>
              </div>

              <div className="border border-border rounded-2xl p-5 space-y-4 shadow-sm bg-primary-soft">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Bank</span>
                  <span className="text-sm font-bold text-foreground">{bankName || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Account Name</span>
                  <span className="text-sm font-bold text-foreground">{accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-foreground">{accountNumber}</span>
                    <button
                      onClick={handleCopyAccount}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <Check size={14} className="text-success" />
                      ) : (
                        <Copy size={14} className="text-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-2xl p-5 bg-primary-soft">
                <p className="text-[10px] text-muted mb-3 uppercase tracking-widest font-bold">Order Details</p>
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-1.5">
                    <span className="text-sm truncate flex-1 text-foreground">
                      {item.product.name}{" "}
                      <span className="text-muted text-xs">×{item.quantity}</span>
                    </span>
                    <span className="text-sm font-bold ml-2 text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase text-foreground/60">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              {canSendReceipt ? (
                <Button onClick={handleSendReceipt} className="w-full" size="lg" isLoading={isLogging}>
                  <MessageCircle size={18} />
                  Send Receipt & Confirm
                </Button>
              ) : (
                <p className="text-xs text-muted text-center">
                  Add a WhatsApp number in store settings to send payment receipts.
                </p>
              )}
              <p className="text-[10px] text-muted text-center">
                After transferring, send your receipt to confirm the order
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-primary-soft">
              <ShoppingBag size={32} className="text-muted" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-foreground">Your bag is empty</h3>
            <p className="text-sm text-muted max-w-[200px] leading-relaxed">
              Browse the pòlówó and add items you love
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 animate-fade-in group">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-border bg-surface-hover">
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
                    <h4 className="text-sm font-bold truncate text-foreground/80">{item.product.name}</h4>
                    <p className="text-base font-bold mt-0.5 text-foreground">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.product.id)
                            : updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 rounded-lg bg-primary-soft hover:bg-surface-hover transition-colors cursor-pointer"
                      >
                        <Minus size={14} className="text-foreground" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.product.id, item.quantity)}
                        className="p-1 rounded-lg bg-primary-soft hover:bg-surface-hover transition-colors cursor-pointer"
                      >
                        <Plus size={14} className="text-foreground" />
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

            <div className="border-t border-border bg-background/50 px-6 py-8 space-y-6 shrink-0">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Billing Info</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-border bg-surface rounded-2xl px-5 py-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border border-border bg-surface rounded-2xl px-5 py-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted font-bold text-xs uppercase tracking-wider">Subtotal</span>
                <span className="text-2xl font-bold tracking-tight text-foreground">{formatPrice(getTotal())}</span>
              </div>

              <div className="space-y-3 pt-2">
                {!canCheckout && (
                  <p className="text-xs text-center text-muted px-2 py-3 rounded-xl border border-border bg-primary-soft">
                    This store has not finished checkout setup yet. Please contact the seller directly.
                  </p>
                )}
                {canCheckout && whatsapp && (
                  <Button
                    onClick={handleWhatsAppCheckout}
                    className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-transform active:scale-95 text-primary-foreground"
                    style={{ backgroundColor: primaryColor || undefined }}
                    isLoading={isLogging}
                  >
                    <MessageCircle size={20} />
                    Message to Buy
                  </Button>
                )}

                {canCheckout && canTransfer && (
                  <Button
                    variant="secondary"
                    className="w-full h-14 border border-border font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-sm"
                    onClick={() => {
                      setShowPayment(true);
                      logEvent(brandId, "transfer_click", undefined, {
                        type: "view_details",
                        total: getTotal(),
                        customerName,
                        customerPhone,
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
