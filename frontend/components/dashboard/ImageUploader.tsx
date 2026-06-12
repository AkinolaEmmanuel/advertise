"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Upload, X } from "lucide-react";
import {
  uploadCloudinaryImage,
  validateImageFile,
  type CloudinaryUploadPurpose,
} from "@/lib/cloudinary";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  purpose: CloudinaryUploadPurpose;
  label: string;
  helpText?: string;
  variant?: "wide" | "square";
  alt?: string;
}

export default function ImageUploader({
  value,
  onChange,
  purpose,
  label,
  helpText,
  variant = "wide",
  alt = "Uploaded image preview",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const isSquare = variant === "square";

  async function handleFileChange(file: File | undefined) {
    if (!file) return;

    try {
      validateImageFile(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please choose a valid image");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const url = await uploadCloudinaryImage(file, purpose, setProgress);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className={isSquare ? "flex items-center gap-4" : "space-y-2"}>
      <button
        type="button"
        className={
          isSquare
            ? "relative w-20 h-20 rounded-2xl bg-surface-hover border-2 border-dashed border-white/10 hover:border-white/30 transition-colors cursor-pointer overflow-hidden shrink-0 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
            : "relative w-full aspect-[4/3] sm:aspect-video bg-surface-hover rounded-xl border-2 border-dashed border-border hover:border-white/30 transition-colors cursor-pointer overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
        }
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {value ? (
          <Image
            src={value}
            alt={alt}
            fill
            sizes={isSquare ? "80px" : "(min-width: 640px) 560px, 100vw"}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted px-4 text-center">
            {isSquare ? <Upload size={20} /> : <ImagePlus size={22} />}
            {!isSquare && <span className="text-sm">{label}</span>}
            {!isSquare && helpText && <span className="text-xs">{helpText}</span>}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-foreground gap-2">
            <Upload size={18} className="animate-pulse" />
            <span className="text-xs font-medium">{progress > 0 ? `${progress}%` : "Uploading"}</span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileChange(event.target.files?.[0])}
      />

      {isSquare ? (
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {helpText && <p className="text-xs text-muted">{helpText}</p>}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="text-xs text-danger hover:underline mt-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      ) : (
        value && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 text-xs text-danger hover:underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={13} />
            Remove image
          </button>
        )
      )}
    </div>
  );
}
