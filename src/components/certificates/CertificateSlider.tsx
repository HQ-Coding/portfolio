"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Width of one card plus the gap between cards. */
function stepOf(el: HTMLElement): number {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return 0;
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  return first.offsetWidth + gap;
}

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/**
 * Horizontal certificate slider.
 * Native scrolling + CSS scroll-snap (touch swipe, trackpad and keyboard work
 * for free). The Prev / Next buttons move one card; the dots show and set the
 * position. Cards are rendered by the server component and passed as children.
 */
export default function CertificateSlider({
  children,
  background,
  header,
}: {
  /** The certificate cards (<li> elements). */
  children: ReactNode;
  /** Decorative layer rendered inside the panel, behind everything. */
  background?: ReactNode;
  /** Heading rendered inside the panel, above the cards. */
  header?: ReactNode;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, active: 0, count: 1 });

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const step = stepOf(el);
    if (!step) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const count = Math.max(1, Math.round(maxScroll / step) + 1);
    const active = Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step)));
    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft >= maxScroll - 1;

    setState((prev) =>
      prev.atStart === atStart &&
      prev.atEnd === atEnd &&
      prev.active === active &&
      prev.count === count
        ? prev
        : { atStart, atEnd, active, count },
    );
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [update]);

  const scrollToIndex = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: index * stepOf(el), behavior: scrollBehavior() });
  };

  const scrollByCard = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * stepOf(el), behavior: scrollBehavior() });
  };

  return (
    <>
      {/* Panel: background image + heading + cards */}
      <div className="cert-stage">
        {background}
        {header}
        <div className="mx-auto w-full max-w-[1200px]">
          <ul ref={scroller} role="list" tabIndex={0} aria-label="Certificates" className="cert-scroller">
            {children}
          </ul>
        </div>
      </div>

      {/* Controls: outside and centred under the panel */}
      <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-5">
        <button
          type="button"
          className="glass-btn cert-prev px-8 py-3 disabled:pointer-events-none disabled:opacity-40"
          onClick={() => scrollByCard(-1)}
          disabled={state.atStart}
          aria-label="Previous certificate"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Prev
        </button>

        {state.count > 1 && (
          <div className="cert-dots" role="group" aria-label="Slider position">
            {Array.from({ length: state.count }, (_, i) => (
              <button
                key={i}
                type="button"
                className="cert-dot"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to position ${i + 1} of ${state.count}`}
                aria-current={i === state.active}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          className="glass-btn cert-next px-8 py-3 disabled:pointer-events-none disabled:opacity-40"
          onClick={() => scrollByCard(1)}
          disabled={state.atEnd}
          aria-label="Next certificate"
        >
          Next
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  );
}