"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "../layout";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  items: any[];
  created_at: string;
}

export default function OrdersPage() {
  const { brand } = useDashboard();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("brand_id", brand.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setIsLoading(false);
    }
    fetchOrders();
  }, [brand.id]);

  async function updateStatus(orderId: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Status update failed");
    } else {
      toast.success(`Order ${status}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: status as any } : o));
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Order Logs</h1>
          <p className="text-muted mt-1">Track and manage your pòlówó sales.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 w-full bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-muted/30">
             <ShoppingBag size={32} />
           </div>
           <h3 className="text-xl font-bold text-white">No Sales Yet</h3>
           <p className="text-muted max-w-sm mt-2">
             Once customers start ordering from your pòlówó, their details will appear here.
           </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface border border-white/5 rounded-2xl p-6 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className={`text-[10px] h-5 px-2 flex items-center rounded-full font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400' : 
                      order.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                      order.status === 'cancelled' ? 'bg-danger/10 text-danger' : 'bg-white/10 text-muted'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{order.customer_name}</h3>
                  <p className="text-sm text-muted">{order.customer_phone}</p>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-muted uppercase tracking-widest font-bold">Total</p>
                    <p className="text-xl font-bold text-white">{formatPrice(order.total_amount)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateStatus(order.id, 'confirmed')}
                      className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-primary transition-colors cursor-pointer"
                      title="Confirm Order"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'delivered')}
                      className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-green-400 transition-colors cursor-pointer"
                      title="Mark Delivered"
                    >
                      <Truck size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="p-2.5 rounded-xl bg-white/5 text-muted hover:text-danger transition-colors cursor-pointer"
                      title="Cancel Order"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
