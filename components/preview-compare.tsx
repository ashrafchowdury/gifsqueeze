"use client";

import { ArrowRight, Loader2, TrendingDown, TriangleAlert } from "lucide-react";
import type { CompressResult, GifInfo } from "@/lib/types";
import { formatBytes, percentSaved } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  originalUrl: string;
  originalSize: number;
  info: GifInfo | null;
  result: CompressResult | null;
  isCompressing: boolean;
}

export function PreviewCompare({
  originalUrl,
  originalSize,
  info,
  result,
  isCompressing,
}: Props) {
  const saved = result ? percentSaved(originalSize, result.size) : 0;
  const bigger = result ? result.size >= originalSize : false;

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      {result && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-lg border p-3 text-center text-sm",
            bigger
              ? "border-amber-500/40 bg-amber-500/5"
              : "border-success/40 bg-success/5",
          )}
        >
          {bigger ? (
            <span className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-500">
              <TriangleAlert className="size-4" />
              Already well-optimized — keep the original
            </span>
          ) : (
            <span className="flex items-center gap-2 font-semibold text-success">
              <TrendingDown className="size-4" />
              Saved {saved}%
            </span>
          )}
          <span className="text-muted-foreground">
            {formatBytes(originalSize)}
            <ArrowRight className="mx-1 inline size-3.5" />
            {formatBytes(result.size)}
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel label="Original" size={originalSize} dims={info}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original GIF"
            className="max-h-64 w-auto rounded-md object-contain"
          />
        </Panel>

        <Panel
          label="Compressed"
          size={result?.size}
          dims={info}
          highlight={!!result && !bigger}
        >
          {isCompressing ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm">Compressing…</span>
            </div>
          ) : result ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.blobUrl}
              alt="Compressed GIF"
              className="max-h-64 w-auto rounded-md object-contain"
            />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Press “Compress GIF” to preview
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  label,
  size,
  dims,
  highlight,
  children,
}: {
  label: string;
  size?: number;
  dims: GifInfo | null;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-muted/20 p-3",
        highlight && "border-success/50",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {size !== undefined && (
          <span className="font-mono text-xs tabular-nums">
            {formatBytes(size)}
          </span>
        )}
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg p-2"
        style={{
          backgroundImage:
            "repeating-conic-gradient(oklch(0.5 0 0 / 0.12) 0% 25%, transparent 0% 50%)",
          backgroundSize: "16px 16px",
        }}
      >
        {children}
      </div>
      {dims && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {dims.width}×{dims.height}
          {dims.frameCount > 1 ? ` · ${dims.frameCount} frames` : ""}
        </p>
      )}
    </div>
  );
}
