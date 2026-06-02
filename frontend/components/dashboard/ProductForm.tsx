"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import type { Product } from "@/lib/types";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

interface ProductFormProps {
  brandId: string;
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ brandId, product, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [quantity, setQuantity] = useState(
    product?.quantity !== undefined && product.quantity >= 0
      ? product.quantity.toString()
      : ""
  );
  const [trackStock, setTrackStock] = useState(
    product?.quantity !== undefined && product.quantity >= 0
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      toast.error("Name and price are required");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    let quantityNum = -1;
    if (trackStock) {
      quantityNum = parseInt(quantity, 10);
      if (isNaN(quantityNum) || quantityNum < 0) {
        toast.error("Please enter a valid quantity");
        return;
      }
    }

    setIsLoading(true);

    const payload = {
      brand_id: brandId,
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      image_url: imageUrl || null,
      quantity: quantityNum,
    };

    try {
      if (product) {
        await apiFetch(`/api/dashboard/products/${product.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Product updated!");
      } else {
        await apiFetch("/api/dashboard/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Product added!");
      }
    } catch {
      if (product) {
        toast.error("Failed to update product");
      } else {
        toast.error("Failed to add product");
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="relative aspect-[4/3] sm:aspect-video bg-surface-hover rounded-xl border-2 border-dashed border-border hover:border-white/30 transition-colors cursor-pointer overflow-hidden"
        onClick={() => {
          const nextUrl = window.prompt("Paste an image URL", imageUrl);
          if (nextUrl !== null) setImageUrl(nextUrl.trim());
        }}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImageUrl("");
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 text-foreground hover:bg-danger hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
            <span className="text-sm">Tap to add image URL</span>
            <span className="text-xs mt-1">Uploads are deferred in this backend split</span>
          </div>
        )}
      </div>

      <Input
        id="product-name"
        label="Product Name"
        placeholder="e.g. Premium T-Shirt"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Textarea
        id="product-description"
        label="Description"
        placeholder="Describe your product..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        id="product-price"
        label="Price (₦)"
        type="number"
        placeholder="0"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={trackStock}
            onChange={(e) => {
              setTrackStock(e.target.checked);
              if (!e.target.checked) setQuantity("");
            }}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-surface-hover rounded-full peer peer-checked:bg-white transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white peer-checked:after:bg-black after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full relative" />
          <span className="text-sm text-muted">Track stock quantity</span>
        </label>

        {trackStock && (
          <Input
            id="product-quantity"
            label="Quantity in Stock"
            type="number"
            placeholder="0"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {product ? "Update" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
