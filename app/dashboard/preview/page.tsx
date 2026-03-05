"use client";

import { useDashboard } from "../layout";
import Button from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PreviewPage() {
  const { brand } = useDashboard();
  const storeUrl = `/${brand.slug}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Preview</h1>
          <p className="text-muted mt-1 text-sm">See your pòlówó as customers see it</p>
        </div>
        <Link href={storeUrl} target="_blank">
          <Button variant="secondary" size="sm">
            <ExternalLink size={14} />
            Open in Tab
          </Button>
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="bg-surface-hover px-4 py-2 flex items-center gap-2 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger/50" />
            <div className="w-3 h-3 rounded-full bg-accent/50" />
            <div className="w-3 h-3 rounded-full bg-success/50" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted">polowo.app/{brand.slug}</span>
          </div>
        </div>
        <iframe
          src={storeUrl}
          className="w-full h-[calc(100vh-220px)] min-h-[500px] border-0"
          title="pòlówó Preview"
        />
      </div>
    </div>
  );
}
