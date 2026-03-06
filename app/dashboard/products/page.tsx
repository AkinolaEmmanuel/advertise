"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "../layout";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/dashboard/ProductCard";
import ProductForm from "@/components/dashboard/ProductForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Plus, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const { brand } = useDashboard();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false });

    if (data) setProducts(data as Product[]);
    setLoading(false);
  }, [brand.id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleToggle(id: string, isActive: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update");
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: isActive } : p))
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function handleFormSuccess() {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted mt-1 text-sm">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}>
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="aspect-square bg-surface-hover animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-surface-hover rounded animate-pulse w-2/3" />
                <div className="h-5 bg-surface-hover rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Package size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No products yet</h3>
          <p className="text-muted text-sm mb-4">Add your first product to get your store live</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <ProductForm
          brandId={brand.id}
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
        />
      </Modal>
    </div>
  );
}
