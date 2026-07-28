import type { GifInfo } from "./types";

/**
 * Read basic GIF metadata using the WebCodecs ImageDecoder API.
 * Returns null when the API is unavailable or decoding fails — callers should
 * degrade gracefully (e.g. hide frame-rate controls) rather than error.
 */
export async function getGifInfo(file: File): Promise<GifInfo | null> {
  if (typeof window === "undefined" || typeof ImageDecoder === "undefined") {
    return null;
  }
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new ImageDecoder({ data: buffer, type: "image/gif" });
    await decoder.tracks.ready;
    const track = decoder.tracks.selectedTrack;
    const frameCount = track?.frameCount ?? 1;

    // Decode the first frame to get real pixel dimensions and a sample delay.
    const { image } = await decoder.decode({ frameIndex: 0 });
    const width = image.displayWidth || image.codedWidth;
    const height = image.displayHeight || image.codedHeight;
    // duration is in microseconds; fall back to 100ms if unknown.
    const avgDelayMs = image.duration ? image.duration / 1000 : 0;
    image.close();
    decoder.close();

    return { width, height, frameCount, avgDelayMs };
  } catch {
    return null;
  }
}
