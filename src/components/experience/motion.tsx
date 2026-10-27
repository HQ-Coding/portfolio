"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Same behaviour as the old script.js `createObserver`:
 * the class is added when the element enters the viewport and removed when it
 * leaves, so the animation replays on every scroll. Pass `once` to play it once.
 */
function useInView<T extends Element>(threshold: number, once: boolean) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView] as const;
}

/** Fade + slide-up (old `.show` class on #experianceINFO). */
export function Reveal({
  children,
  className = "",
  threshold = 0.3,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
  once?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(threshold, once);

  return (
    <div ref={ref} className={`exp-reveal ${className}`} data-visible={inView}>
      {children}
    </div>
  );
}

/** Skill bar whose fill animates from 0 (old `.fill` / `.filled` classes). */
export function SkillBar({
  name,
  level,
  percent,
  showPercent = true,
  once = false,
}: {
  name: string;
  level: string;
  percent: number;
  showPercent?: boolean;
  once?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.5, once);
  const value = Math.min(100, Math.max(0, percent));

  return (
    <div ref={ref} className="exp-skill">
      <div className="font-extrabold uppercase">{name}</div>
      <p className="exp-muted mb-2 text-sm italic">{level}</p>
      <div
        className="exp-bar"
        role="progressbar"
        aria-label={`${name}, ${level}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        style={{ "--value": value / 100 } as CSSProperties}
      >
        <div className="exp-fill" data-filled={inView} />
        {showPercent && (
          <span className="exp-percent" aria-hidden="true">
            {value}%
          </span>
        )}
      </div>
    </div>
  );
}
