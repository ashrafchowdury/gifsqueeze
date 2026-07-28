import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/renzhezhilu/gifsicle-wasm-browser"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Powered by gifsicle
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
