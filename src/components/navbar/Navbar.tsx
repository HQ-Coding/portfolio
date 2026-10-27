"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import ThemeToggle from "../theme/ThemeToggle";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#projects", label: "Projects" },
];

const hiddenOn = ["/login", "/dashboard"];
const ease = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function Navbar({ logo = "HQ | Portfolio" }: { logo?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Open drawer: lock scroll + Escape closes.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close on wide screens.
  useEffect(() => {
    const q = window.matchMedia("(min-width: 768px)");
    const onChange = () => q.matches && setOpen(false);
    q.addEventListener("change", onChange);
    return () => q.removeEventListener("change", onChange);
  }, []);

  // Must stay AFTER all hooks.
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;

  /**
   * Smooth-scroll to a section on the home page, even when the URL already
   * has the same #hash (a normal <Link> does nothing in that case).
   * On any other page we let <Link> navigate to "/#section" as usual.
   */
  function goTo(e: MouseEvent<HTMLAnchorElement>, href: string) {
    const id = href.replace("/#", "");
    const el = document.getElementById(id);
    if (pathname !== "/" || !el) {
      setOpen(false);
      return;
    }

    e.preventDefault();
    setOpen(false); // closes the mobile drawer (and unlocks body scroll)

    // wait a frame so the scroll lock from the open drawer is released first
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  }

  const bar = `absolute right-0 h-0.5 rounded-full bg-current transition-all duration-500 ${ease}`;

  return (
    <>
      <header className="sticky top-0 z-80 border-b border-(--border) bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5"
        >
          <Link
            href="/"
            className="whitespace-nowrap text-xl font-semibold tracking-wide text-(--fg) sm:text-2xl"
          >
            {logo}
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center gap-1">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => goTo(e, item.href)}
                    className="relative block px-3 py-2 text-(--fg) after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-(--fg) after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mx-2">
              <ThemeToggle />
            </div>
            <Link
              href="/#contact"
              onClick={(e) => goTo(e, "/#contact")}
              className="fold-btn text-sm"
            >
              Contact
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-(--fg) transition-colors hover:bg-(--surface)"
            >
              <span className="relative block h-3.5 w-5">
                <span className={`${bar} w-full ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
                <span className={`${bar} top-1/2 -translate-y-1/2 ${open ? "w-0 opacity-0" : "w-3/4 opacity-100"}`} />
                <span className={`${bar} ${open ? "top-1/2 w-full -translate-y-1/2 -rotate-45" : "bottom-0 w-1/2"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay (below the header, so the header stays crisp) */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 top-16 z-60 bg-(--overlay) backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Side drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        className={`fixed bottom-0 right-0 top-16 z-70 flex w-[min(22rem,88vw)] flex-col border-l border-(--border) bg-(--bg) px-6 pb-8 pt-6 shadow-2xl transition-[transform,visibility] duration-500 ${ease} motion-reduce:transition-none md:hidden ${
          open
            ? "visible translate-x-0"
            : "invisible translate-x-full [transition-delay:0s,0.5s]"
        }`}
      >
        <ul className="flex flex-col">
          {links.map((item, i) => (
            <li
              key={item.href}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              className={`border-b border-(--border) transition-all duration-500 ${ease} ${
                open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
            >
              <Link
                href={item.href}
                onClick={(e) => goTo(e, item.href)}
                className="group flex items-baseline gap-4 py-4 text-xl text-(--fg)"
              >
                <span className="text-xs text-(--muted)">0{i + 1}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div
          style={{ transitionDelay: open ? `${120 + links.length * 70}ms` : "0ms" }}
          className={`mt-auto transition-all duration-500 ${ease} ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/#contact"
            onClick={(e) => goTo(e, "/#contact")}
            className="fold-btn w-full py-3.5"
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}