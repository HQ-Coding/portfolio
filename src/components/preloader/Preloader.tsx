"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen preloader.
 * Place this file at: components/preloader/Preloader.tsx
 *
 * How it behaves:
 *  - Shows on first load, then hides as soon as the page AND fonts are ready.
 *  - Stays at least `minDuration` ms so it never flashes for a split second.
 *  - Never longer than `maxDuration` ms, even if something loads slowly.
 *  - With `oncePerSession`, a page reload in the same tab skips it.
 *  - Pure CSS animation (no timers running in JS).
 *  - Uses your theme variables (--bg, --fg, --accent), so dark mode works.
 *  - If the logo image fails to load, it falls back to the `mark` text.
 */

type PreloaderProps = {
  /** Logo image from /public, e.g. "/images/logo.webp". */
  logoSrc?: string;
  /** Text shown in the circle when there is no logo image (or it fails). */
  mark?: string;
  /** Minimum time on screen (ms). */
  minDuration?: number;
  /** Maximum time on screen (ms). */
  maxDuration?: number;
  /** Skip the preloader on reloads within the same browser tab session. */
  oncePerSession?: boolean;
};

const STORAGE_KEY = "preloader-seen";
const FADE_MS = 550;
const WAVE_DOTS = 14;

export default function Preloader({
  logoSrc = "/images/logo.webp",
  mark = "HQ",
  minDuration = 700,
  maxDuration = 4000,
  oncePerSession = true,
}: PreloaderProps) {
  // "show" -> "hide" (fading out) -> "gone" (removed from the DOM)
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");
  const [imgFailed, setImgFailed] = useState(false);

  // 1) Decide when to start hiding.
  useEffect(() => {
    if (oncePerSession) {
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) {
          setPhase("gone");
          return;
        }
      } catch {
        // storage blocked: just show the preloader normally
      }
    }

    const start = performance.now();
    let finished = false;
    let minTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, minDuration - (performance.now() - start));
      minTimer = setTimeout(() => setPhase("hide"), wait);
    };

    // Ready = window "load" + fonts loaded.
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const fontsLoaded: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

    Promise.all([pageLoaded, fontsLoaded]).then(finish);

    // Safety net: never keep the visitor waiting longer than maxDuration.
    const maxTimer = setTimeout(finish, maxDuration);

    return () => {
      clearTimeout(maxTimer);
      if (minTimer) clearTimeout(minTimer);
    };
  }, [minDuration, maxDuration, oncePerSession]);

  // 2) Lock scrolling while visible, unlock + remove after the fade.
  useEffect(() => {
    if (phase === "show") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }

    if (phase === "hide") {
      try {
        if (oncePerSession) sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      const t = setTimeout(() => setPhase("gone"), FADE_MS);
      return () => clearTimeout(t);
    }
  }, [phase, oncePerSession]);

  if (phase === "gone") return null;

  return (
    <div
      className="pl-root"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="pl-orb">
        <span className="pl-ring" />
        {logoSrc && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt=""
            className="pl-logo"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="pl-mark">{mark}</span>
        )}
      </div>

      <p className="pl-text">
        Loading
        <span className="pl-dots" aria-hidden="true">
          <i>.</i>
          <i>.</i>
          <i>.</i>
        </span>
      </p>

      <div className="pl-wave" aria-hidden="true">
        {Array.from({ length: WAVE_DOTS }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.07}s` }} />
        ))}
      </div>

      <style>{`
        .pl-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.75rem;
          background: var(--bg, #fff);
          color: var(--fg, #111);
          transition:
            opacity ${FADE_MS}ms ease,
            visibility ${FADE_MS}ms ease,
            transform ${FADE_MS}ms ease;
          /* Failsafe: if JS never runs, the overlay still disappears. */
          animation: pl-failsafe 0.01s linear 8s forwards;
        }
        .pl-root[data-phase="hide"] {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(1.03);
        }

        .pl-orb {
          position: relative;
          display: grid;
          place-items: center;
          width: 132px;
          height: 132px;
        }
        .pl-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid color-mix(in srgb, var(--fg, #111) 12%, transparent);
          border-top-color: var(--accent, #880709);
          animation: pl-spin 1s linear infinite;
        }
        .pl-mark {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .pl-logo {
          width: 72px;
          height: 72px;
          object-fit: contain;
          animation: pl-float 2.2s ease-in-out infinite;
        }

        .pl-text {
          font-size: 0.85rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .pl-dots i {
          display: inline-block;
          font-style: normal;
          animation: pl-blink 1.2s infinite both;
        }
        .pl-dots i:nth-child(2) { animation-delay: 0.2s; }
        .pl-dots i:nth-child(3) { animation-delay: 0.4s; }

        .pl-wave {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
        }
        .pl-wave span {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: var(--fg, #111);
          animation: pl-wave 1s ease-in-out infinite;
        }

        @keyframes pl-spin { to { transform: rotate(360deg); } }
        @keyframes pl-float {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        @keyframes pl-blink {
          0%, 80%, 100% { opacity: 0.15; }
          40% { opacity: 1; }
        }
        @keyframes pl-wave {
          0%, 100% { transform: translateY(-10px); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
        @keyframes pl-failsafe {
          to { opacity: 0; visibility: hidden; pointer-events: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pl-ring, .pl-logo, .pl-wave span, .pl-dots i { animation: none; }
          .pl-dots i { opacity: 0.6; }
          .pl-root[data-phase="hide"] { transform: none; }
        }
      `}</style>
    </div>
  );
}