import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7", className)}
      aria-hidden="true"
    >
      <rect
        x="9"
        y="6"
        width="14"
        height="20"
        rx="3"
        className="fill-primary/15 stroke-primary"
        strokeWidth="1.5"
      />
      {/* left squeeze arrow */}
      <path
        d="M6 16H1M3.5 12.5 7 16l-3.5 3.5"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* right squeeze arrow */}
      <path
        d="M26 16h5M28.5 12.5 25 16l3.5 3.5"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* GIF spark */}
      <circle cx="16" cy="16" r="2.5" className="fill-primary" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">
        GIF<span className="text-primary">Squeeze</span>
      </span>
    </div>
  );
}
