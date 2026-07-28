import type { CompressOptions, CompressResult, GifInfo } from "./types";

/** Slider max = fully lossless. */
export const MAX_QUALITY = 80;
/** Multiplier that maps quality below max onto gifsicle's --lossy scale (1–200). */
const LOSSY_SCALE = 160;

/**
 * Map the 1–80 quality slider to a gifsicle `--lossy` value.
 * At quality 80 there is no lossy pass (pure -O3, lossless). Lower quality
 * yields a larger lossy value = more compression + more artifacts.
 */
export function qualityToLossy(quality: number): number {
  const q = Math.max(1, Math.min(MAX_QUALITY, Math.round(quality)));
  if (q >= MAX_QUALITY) return 0;
  return Math.max(1, Math.round(((MAX_QUALITY - q) / (MAX_QUALITY - 1)) * LOSSY_SCALE));
}

/**
 * Build the gifsicle command string for the given options.
 * Always applies lossless -O3 optimization; other flags are additive.
 * `info` is used only for frame-dropping (needs frame count + delay).
 */
export function buildCommand(
  opts: CompressOptions,
  info?: GifInfo | null,
  inputName = "in.gif",
): string {
  const parts: string[] = ["-O3"];

  const lossy = qualityToLossy(opts.quality);
  if (lossy > 0) parts.push(`--lossy=${lossy}`);

  if (opts.colors && opts.colors >= 2 && opts.colors <= 256) {
    parts.push(`--colors=${Math.round(opts.colors)}`);
    if (opts.dither) parts.push("--dither");
  }

  if (opts.resizeWidth && opts.resizeWidth > 0) {
    // `x_` keeps the aspect ratio, computing height automatically.
    parts.push(`--resize=${Math.round(opts.resizeWidth)}x_`);
  }

  // Frame dropping: keep every Nth frame and rescale the delay so playback
  // speed stays roughly the same. Requires a known frame count.
  const step = opts.frameStep ?? 1;
  const frameSelection: string[] = [];
  if (step > 1 && info && info.frameCount > 1) {
    for (let i = 0; i < info.frameCount; i += step) frameSelection.push(`#${i}`);
    if (info.avgDelayMs > 0) {
      const delayCs = Math.max(2, Math.round((info.avgDelayMs / 10) * step));
      parts.push(`-d${delayCs}`);
    }
  }

  const input =
    frameSelection.length > 0
      ? `${inputName} ${frameSelection.join(" ")}`
      : inputName;

  // Command MUST end by writing to /out/*.gif for the wasm runtime to export it.
  return `${parts.join(" ")} ${input} -o /out/out.gif`;
}

/**
 * Compress a GIF entirely in the browser via gifsicle-wasm-browser.
 * The library is imported dynamically so it never runs during SSR/build.
 */
export async function compressGif(
  file: File,
  opts: CompressOptions,
  info?: GifInfo | null,
): Promise<CompressResult> {
  const gifsicle = (await import("gifsicle-wasm-browser")).default;

  const command = buildCommand(opts, info);

  const output = await gifsicle.run({
    input: [{ file, name: "in.gif" }],
    command: [command],
  });

  const outFile = output?.[0];
  if (!outFile) {
    throw new Error("Compression produced no output. The GIF may be invalid.");
  }

  return {
    file: outFile,
    size: outFile.size,
    blobUrl: URL.createObjectURL(outFile),
  };
}
