"use client";

import { Download, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Dropzone } from "@/components/dropzone";
import { PreviewCompare } from "@/components/preview-compare";
import { QualityControls } from "@/components/quality-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { compressGif } from "@/lib/compress";
import { getGifInfo } from "@/lib/gif-info";
import type { CompressOptions, CompressResult, GifInfo } from "@/lib/types";

const DEFAULT_OPTIONS: CompressOptions = { quality: 80 };

export function GifCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [info, setInfo] = useState<GifInfo | null>(null);
  const [options, setOptions] = useState<CompressOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Track the latest object URLs so we can revoke them safely.
  const originalUrlRef = useRef<string>("");
  const resultUrlRef = useRef<string>("");
  originalUrlRef.current = originalUrl;
  resultUrlRef.current = result?.blobUrl ?? "";

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const handleFile = useCallback(async (f: File) => {
    // Clean up any previous session.
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);

    setResult(null);
    setOptions(DEFAULT_OPTIONS);
    setInfo(null);
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));

    const gifInfo = await getGifInfo(f);
    setInfo(gifInfo);
  }, []);

  const reset = useCallback(() => {
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    setFile(null);
    setOriginalUrl("");
    setInfo(null);
    setResult(null);
    setOptions(DEFAULT_OPTIONS);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const next = await compressGif(file, options, info);
      // Revoke the previous result URL before replacing it.
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      setResult(next);
    } catch (err) {
      console.error(err);
      toast.error("Compression failed", {
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Try a different GIF or settings.",
      });
    } finally {
      setIsCompressing(false);
    }
  }, [file, options, info]);

  const handleChange = useCallback((patch: Partial<CompressOptions>) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  }, []);

  const download = useCallback(() => {
    if (!result || !file) return;
    const base = file.name.replace(/\.gif$/i, "");
    const a = document.createElement("a");
    a.href = result.blobUrl;
    a.download = `${base}-compressed.gif`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [result, file]);

  if (!file) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <Dropzone onFile={handleFile} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{file.name}</span>
        </p>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="size-4" />
          Choose another
        </Button>
      </div>

      <PreviewCompare
        originalUrl={originalUrl}
        originalSize={file.size}
        info={info}
        result={result}
        isCompressing={isCompressing}
      />

      {result && (
        <Button size="lg" className="w-full" variant="default" onClick={download}>
          <Download className="size-4" />
          Download compressed GIF
        </Button>
      )}

      <Card>
        <CardContent className="p-4 sm:p-6">
          <QualityControls
            options={options}
            onChange={handleChange}
            info={info}
            isCompressing={isCompressing}
            onCompress={handleCompress}
          />
        </CardContent>
      </Card>
    </div>
  );
}
