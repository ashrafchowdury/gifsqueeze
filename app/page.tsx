import { GifCompressor } from "@/components/gif-compressor";
import { Header } from "@/components/header";
import { Lock, Zap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
        <div className="mb-8 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Compress GIFs, keep the quality
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Lossless optimization by default, with an adjustable quality slider
            when you need a smaller file. Everything runs in your browser.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5" /> 100% private — no uploads
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5" /> Runs on WebAssembly
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Powered by gifsicle
            </span>
          </div>
        </div>

        <GifCompressor />
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Built with Next.js, Tailwind & shadcn/ui · GIFs never leave your device.
      </footer>
    </>
  );
}
