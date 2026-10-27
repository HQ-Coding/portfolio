import Image from "next/image";
import type { CSSProperties } from "react";
import type { Certificate } from "@/lib/types";
import CertificateSlider from "./CertificateSlider";
import "./certificates.css";

/* ---------- helpers ---------- */

/** Picks white or near-black, whichever has more contrast on the card colour. */
function readableOn(color: string): string {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return "#fff";

  let hex = match[1];
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");

  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const contrastWithWhite = 1.05 / (luminance + 0.05);
  const contrastWithDark = (luminance + 0.05) / 0.05;
  return contrastWithWhite >= contrastWithDark ? "#fff" : "#111";
}

/* ---------- icons (stroke icons inherit currentColor) ---------- */

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Graduation cap. */
function CapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...strokeProps}>
      <path d="M2 9.5 12 5l10 4.5-10 4.5z" />
      <path d="M6 11.8V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.2" />
      <path d="M22 9.5V15" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...strokeProps}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18M8 3v3M16 3v3" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...strokeProps}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

/** Award ribbon: double ring, star, two tails. */
function RibbonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 72"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="32" cy="26" r="20" />
      <circle cx="32" cy="26" r="14.5" />
      <path d="M32 18.5 33.82 23.49 39.13 23.68 34.95 26.96 36.41 32.07 32 29.1 27.59 32.07 29.05 26.96 24.87 23.68 30.18 23.49Z" />
      <path d="M22.3 43 15 66l9-4.5 4 7 3.5-22.5" />
      <path d="M41.7 43 49 66l-9-4.5-4 7-3.5-22.5" />
    </svg>
  );
}

/* ---------- section ---------- */

type CertificatesProps = {
  certificates: Certificate[];
  subtitle?: string;
};

export default function Certificates({
  certificates,
  subtitle = "Professional certifications and achievements",
}: CertificatesProps) {
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="container mx-auto mb-20 max-w-7xl scroll-mt-24 px-5">
      <CertificateSlider
        background={
          /* Parallax background: the image is fixed to the viewport and clipped to the panel */
          <div className="cert-bg" aria-hidden="true">
            <div className="cert-bg-fixed">
              <Image
                src="/images/optional-Background-01.png"
                alt=""
                fill
                sizes="100vw"
                quality={70}
                className="object-cover"
              />
            </div>
            <div className="cert-bg-scrim" />
          </div>
        }
        header={
          <header className="mb-5 flex flex-col items-center text-center">
            <div className="flex w-full items-center justify-center gap-6">
              <span className="cert-rule cert-rule-left" aria-hidden="true" />
              <RibbonIcon className="cert-ribbon" />
              <span className="cert-rule cert-rule-right" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              My <span className="cert-title-accent">Certificates</span>
            </h2>
            <p className="cert-subtitle mt-3">{subtitle}</p>
          </header>
        }
      >
        {certificates.map((cert) => (
          <li key={cert.slug} className="cert-item">
            <article
              className="cert-card"
              style={
                {
                  "--cert": cert.color,
                  "--cert-on": readableOn(cert.color),
                } as CSSProperties
              }
            >
              <div className="cert-glow" aria-hidden="true" />
              <svg className="cert-decor" viewBox="0 0 160 160" fill="none" stroke="currentColor" aria-hidden="true">
                <circle cx="160" cy="0" r="46" strokeWidth="3" opacity="0.55" />
                <circle cx="160" cy="0" r="72" strokeWidth="3" opacity="0.4" />
                <circle cx="160" cy="0" r="98" strokeWidth="3" opacity="0.28" />
                <circle cx="160" cy="0" r="124" strokeWidth="3" opacity="0.16" />
              </svg>

              <div className="cert-logo">
                <svg viewBox="0 0 640 640" aria-hidden="true">
                  <path d={cert.iconPath} />
                </svg>
              </div>

              <h3 className="cert-issuer">{cert.issuer}</h3>
              <p className="cert-name">{cert.name}</p>

              <div className="cert-meta">
                <div className="cert-meta-item">
                  <CapIcon className="cert-meta-icon" />
                  <span>Online</span>
                </div>
                {cert.year ? (
                  <div className="cert-meta-item cert-meta-year">
                    <CalendarIcon className="cert-meta-icon" />
                    <span>{cert.year}</span>
                  </div>
                ) : null}
              </div>

              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate
                <ExternalIcon className="cert-link-icon" />
                <span className="sr-only">
                  : {cert.name} by {cert.issuer} (opens in a new tab)
                </span>
              </a>
            </article>
          </li>
        ))}
      </CertificateSlider>
    </section>
  );
}