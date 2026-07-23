import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent" | "secondary";
}) {
  const tones = {
    default: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--surface-border)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent",
    secondary: "bg-[var(--secondary-soft)] text-[var(--secondary)] border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-mono tracking-tight",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function TodoBadge({ children }: { children: React.ReactNode }) {
  return <span className="todo-badge">TODO · {children}</span>;
}
