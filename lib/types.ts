export interface CompressOptions {
  /** Quality on a 1–80 scale. 80 = lossless baseline, lower = smaller file. */
  quality: number;
  /** Optional target width in px (height auto, aspect preserved). */
  resizeWidth?: number;
  /** Optional palette size, 2–256. */
  colors?: number;
  /** Apply Floyd–Steinberg dithering when reducing colors. */
  dither?: boolean;
  /** Keep every Nth frame (1 = keep all, 2 = drop every other, 3 = keep 1/3). */
  frameStep?: number;
}

/** Metadata read from the source GIF (via the WebCodecs ImageDecoder). */
export interface GifInfo {
  width: number;
  height: number;
  frameCount: number;
  /** Average per-frame delay in milliseconds (0 if unknown). */
  avgDelayMs: number;
}

export interface CompressResult {
  /** Object URL for the compressed GIF (revoke when superseded). */
  blobUrl: string;
  /** Compressed size in bytes. */
  size: number;
  file: File;
  width?: number;
  height?: number;
}
