# GIFSqueeze

Compress GIFs, keep the quality — a fast, private GIF compressor that runs **entirely in your browser**. No uploads, no server, no database.

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and [gifsicle compiled to WebAssembly](https://github.com/renzhezhilu/gifsicle-wasm-browser).

## How it works

- **Lossless baseline** — every compression runs gifsicle `-O3` optimization, which shrinks the file with *zero* visual quality loss.
- **Quality slider (1–80)** — layers gifsicle's lossy compression on top. At **80** there is no lossy pass (fully lossless); lower values trade quality for a smaller file.
- **Advanced options** — optional resize (width), color-palette reduction (with dithering), and frame-rate reduction.

Because all processing happens client-side via WebAssembly, your GIFs never leave your device.

## Features

- Drag & drop, file picker, or paste-from-clipboard upload
- Adjustable 1–80 quality slider with a lossless default
- Before/after preview with size and “% saved” stats
- Advanced controls: resize, reduce colors + dithering, drop frames
- One-click download of the compressed GIF
- Light / dark mode
- Robust error handling (invalid files, failed compression, already-optimized GIFs)

## Getting started

```bash
pnpm install
pnpm dev
```

Go to [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

This is a standard Next.js app with no backend, environment variables, or database, so it deploys on Vercel with zero extra configuration — import the repo and deploy. All compute is client-side WebAssembly.

> If the WASM worker ever requires cross-origin isolation in your environment, add COOP/COEP response headers in `next.config.ts` via the `headers()` option.

## Tech stack

| Concern            | Choice                                   |
| ------------------ | ---------------------------------------- |
| Framework          | Next.js (App Router) + TypeScript        |
| Styling            | Tailwind CSS                             |
| Components         | shadcn/ui                                |
| Compression engine | `gifsicle-wasm-browser` (WebAssembly)    |
