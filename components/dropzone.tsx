"use client";

import { ImageUp, ClipboardPaste } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_WARN_BYTES = 30 * 1024 * 1024; // 30 MB

function isGif(file: File): boolean {
  return (
    file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")
  );
}

export function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (!isGif(file)) {
        toast.error("That's not a GIF", {
          description: "Please choose a file ending in .gif.",
        });
        return;
      }
      if (file.size === 0) {
        toast.error("That file is empty", {
          description: "The GIF appears to be 0 bytes.",
        });
        return;
      }
      if (file.size > MAX_WARN_BYTES) {
        toast.warning("Large GIF", {
          description: "Compression may take a while for files over 30 MB.",
        });
      }
      onFile(file);
    },
    [onFile],
  );

  // Paste-from-clipboard support (anywhere on the page).
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.includes("gif"),
      );
      const file = item?.getAsFile();
      if (file) {
        e.preventDefault();
        accept(file);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [accept]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/60 hover:bg-muted/40",
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ImageUp className="size-7" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-medium">
          Drop a GIF here, or click to browse
        </p>
        <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <ClipboardPaste className="size-3.5" />
          You can also paste from your clipboard
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/gif,.gif"
        className="hidden"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
