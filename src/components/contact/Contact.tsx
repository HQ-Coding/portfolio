"use client";

import { useEffect, useState, type FormEvent } from "react";

/**
 * Contact section.
 * Place this file at: components/contact/Contact.tsx
 * Place the banner image at: public/images/contact-banner.png
 *
 * The form has no backend: it opens the visitor's mail app with the message
 * already written (mailto). Swap `handleSubmit` for an API call later if you want.
 */

type ContactProps = {
  email: string;
  githubUrl: string;
  linkedinUrl: string | null;
};

const BANNER_SRC = "/images/contacts.jpg";

/* ---------------- Icons ---------------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function GithubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function CopyIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2.2} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />
    </svg>
  );
}

/* ---------------- Small pieces ---------------- */

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border
        border-foreground/10 bg-background p-4
        shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300
        hover:-translate-y-1 hover:border-foreground/30
        hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center
          rounded-xl bg-foreground/[0.06] text-foreground transition-colors
          duration-300 group-hover:bg-[var(--accent)] group-hover:text-white"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
          {label}
        </span>
        <span className="block truncate text-sm font-medium text-foreground">
          {value}
        </span>
      </span>
    </a>
  );
}

const fieldClass =
  "w-full rounded-xl border border-foreground/15 bg-transparent px-4 py-3 " +
  "text-sm text-foreground placeholder:text-foreground/40 outline-none " +
  "transition-colors focus:border-[var(--accent)]";

/* ---------------- Section ---------------- */

export default function Contact({ email, githubUrl, linkedinUrl }: ContactProps) {
  const [copied, setCopied] = useState(false);

  // `new Date()` can't run during render with cacheComponents (it would be
  // frozen at build time), so the year is set after the component mounts.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked (e.g. insecure context): do nothing
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\n— ${name}${from ? ` (${from})` : ""}`;

    window.location.href =
      `mailto:${email}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 px-5 pb-20 pt-10 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28"
    >
      <div className="mx-auto max-w-[1380px]">
        {/* Banner */}
        <div
          className="relative mb-14 overflow-hidden rounded-3xl border
            border-foreground/10 bg-neutral-900
            shadow-[0_18px_50px_rgba(0,0,0,0.25)] sm:mb-16"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BANNER_SRC}
            alt="Hadi Qasemian — Biomedical Engineer | Front-End Developer"
            className="h-44 w-full object-cover object-center sm:h-auto sm:aspect-[4/1]"
          />
        </div>

        {/* Heading */}
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-foreground/25" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/60 sm:text-xs">
              Get In Touch
            </p>
            <span className="h-px w-8 bg-foreground/25" />
          </div>

          <h2 className="text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
            Contact Me<span className="text-[var(--accent)]">.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-foreground/60 sm:text-base">
            Have a project in mind or just want to say hi? Send me a message
            and I&apos;ll get back to you as soon as I can.
          </p>
        </header>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Left: contact cards */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <ContactCard
              icon={<MailIcon className="h-5 w-5" />}
              label="Email"
              value={email}
              href={`mailto:${email}`}
            />

            {githubUrl && (
              <ContactCard
                icon={<GithubIcon className="h-5 w-5" />}
                label="GitHub"
                value={githubUrl.replace(/^https?:\/\/(www\.)?/, "")}
                href={githubUrl}
              />
            )}

            {linkedinUrl && (
              <ContactCard
                icon={<LinkedinIcon className="h-5 w-5" />}
                label="LinkedIn"
                value={linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                href={linkedinUrl}
              />
            )}

            <button
              type="button"
              onClick={copyEmail}
              className="glass-btn mt-2 px-6 py-3 text-sm"
              aria-live="polite"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Email copied" : "Copy email"}
            </button>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-2xl border border-foreground/10
              bg-background p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-8 lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">
                Name
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">
                Your email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">
              Message
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell me about your project..."
                className={`${fieldClass} resize-none`}
              />
            </label>

            <button
              type="submit"
              className="fold-btn mt-2 gap-2 self-start !rounded-full !px-7 !py-3 text-sm"
            >
              Send Message
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </div>

        <footer className="mt-16 text-center text-xs text-foreground/40">
          &copy; {year ?? ""} Hadi Qasemian. All rights reserved.
        </footer>
      </div>
    </section>
  );
}