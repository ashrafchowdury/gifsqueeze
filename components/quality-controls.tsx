"use client";

import { ChevronDown, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MAX_QUALITY } from "@/lib/compress";
import type { CompressOptions, GifInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Base UI's Slider reports `number | number[]`; we always use single-thumb. */
function firstValue(v: number | readonly number[]): number {
  return Array.isArray(v) ? v[0] : (v as number);
}

interface Props {
  options: CompressOptions;
  onChange: (patch: Partial<CompressOptions>) => void;
  info: GifInfo | null;
  isCompressing: boolean;
  onCompress: () => void;
}

export function QualityControls({
  options,
  onChange,
  info,
  isCompressing,
  onCompress,
}: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const q = options.quality;
  const qualityLabel =
    q >= MAX_QUALITY
      ? "Lossless — no visible quality loss"
      : q >= 55
        ? "High quality"
        : q >= 30
          ? "Balanced"
          : "Maximum compression";

  return (
    <div className="space-y-6">
      {/* Quality slider */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <Label className="text-sm font-medium">Compression quality</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {q} / {MAX_QUALITY}
          </span>
        </div>
        <Slider
          min={1}
          max={MAX_QUALITY}
          step={1}
          value={[q]}
          onValueChange={(v) => onChange({ quality: firstValue(v) })}
          disabled={isCompressing}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Smaller file</span>
          <span
            className={cn(
              "font-medium",
              q >= MAX_QUALITY ? "text-success" : "text-foreground",
            )}
          >
            {qualityLabel}
          </span>
          <span>Best quality</span>
        </div>
      </div>

      {/* Advanced options */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <span className="flex items-center gap-1.5">
            <Wand2 className="size-4" />
            Advanced options
          </span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              advancedOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-5 pt-4">
          {/* Resize */}
          <ToggleRow
            label="Resize width"
            description={
              info ? `Original: ${info.width}px wide` : "Scale down dimensions"
            }
            enabled={options.resizeWidth !== undefined}
            disabled={isCompressing}
            onToggle={(on) =>
              onChange({ resizeWidth: on ? (info?.width ?? 480) : undefined })
            }
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={16}
                max={info?.width ?? 4000}
                value={options.resizeWidth ?? ""}
                disabled={isCompressing}
                onChange={(e) =>
                  onChange({
                    resizeWidth: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-28"
              />
              <span className="text-sm text-muted-foreground">px</span>
            </div>
          </ToggleRow>

          {/* Colors */}
          <ToggleRow
            label="Reduce colors"
            description="Fewer palette colors = smaller file"
            enabled={options.colors !== undefined}
            disabled={isCompressing}
            onToggle={(on) => onChange({ colors: on ? 128 : undefined })}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Colors</span>
                <span className="font-mono text-sm tabular-nums">
                  {options.colors ?? 256}
                </span>
              </div>
              <Slider
                min={2}
                max={256}
                step={1}
                value={[options.colors ?? 256]}
                disabled={isCompressing}
                onValueChange={(v) => onChange({ colors: firstValue(v) })}
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch
                  checked={options.dither ?? false}
                  disabled={isCompressing}
                  onCheckedChange={(v) => onChange({ dither: v })}
                />
                Dithering (smoother gradients)
              </label>
            </div>
          </ToggleRow>

          {/* Frame rate */}
          {info && info.frameCount > 1 && (
            <ToggleRow
              label="Reduce frames"
              description={`${info.frameCount} frames — drop frames to shrink further`}
              enabled={(options.frameStep ?? 1) > 1}
              disabled={isCompressing}
              onToggle={(on) => onChange({ frameStep: on ? 2 : 1 })}
            >
              <div className="flex gap-2">
                {[
                  { step: 2, label: "Keep 1 of 2" },
                  { step: 3, label: "Keep 1 of 3" },
                ].map(({ step, label }) => (
                  <Button
                    key={step}
                    type="button"
                    size="sm"
                    variant={
                      options.frameStep === step ? "default" : "outline"
                    }
                    disabled={isCompressing}
                    onClick={() => onChange({ frameStep: step })}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </ToggleRow>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Compress button */}
      <Button
        size="lg"
        className="w-full"
        onClick={onCompress}
        disabled={isCompressing}
      >
        {isCompressing ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Compressing…
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Compress GIF
          </>
        )}
      </Button>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  disabled,
  onToggle,
  children,
}: {
  label: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (on: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3.5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch
          checked={enabled}
          disabled={disabled}
          onCheckedChange={onToggle}
        />
      </div>
      {enabled && <div className="mt-3.5">{children}</div>}
    </div>
  );
}
