"use client";

import { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<HTMLMotionProps<"button">, "ref"> & {
  variant?: "primary" | "secondary" | "ghost";
  magnetic?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", magnetic = true, children, ...props },
    ref
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
    const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !innerRef.current) return;
      const rect = innerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      x.set(relX * 0.25);
      y.set(relY * 0.25);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    const base =
      "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary:
        "bg-[var(--accent)] text-[#12100b] hover:bg-[var(--accent-strong)] shadow-[0_0_0_1px_rgba(240,168,60,0.4),0_8px_30px_-8px_rgba(240,168,60,0.55)]",
      secondary:
        "border border-[var(--surface-border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
      ghost: "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
    };

    return (
      <motion.button
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
        }}
        style={{ x: sx, y: sy }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
