import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Reveal>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </span>
        <h2 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
