"use client";

import { useEffect, useState } from "react";

export function TypingRoles({ roles }: { roles: string[] }) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(roles[0]);
      return;
    }

    const current = roles[roleIndex];
    const speed = deleting ? 40 : 70;
    const pause = 1400;

    const timeout = setTimeout(
      () => {
        if (!deleting && text === current) {
          setTimeout(() => setDeleting(true), pause);
          return;
        }
        if (deleting && text === "") {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
          return;
        }
        setText((t) =>
          deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
        );
      },
      text === current && !deleting ? pause : speed
    );

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles, reducedMotion]);

  return (
    <span className="font-mono">
      {text}
      <span className="animate-pulse text-[var(--accent)]">_</span>
    </span>
  );
}
