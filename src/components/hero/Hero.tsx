
import Image from "next/image";
import "./hero.css";

type HeroProps = {
  name: string;
  title: string;
  heroGreeting: string;
  cvUrl: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
};

export default function Hero({
  name,
  title,
  heroGreeting,
  cvUrl,
  githubUrl,
  linkedinUrl,
}: HeroProps) {
  const words = title.split(" ");

  return (
    <section className="hero-wrap mx-auto mb-20 mt-10 w-full py-5 text-center md:mt-20">
      <div className="hero-box flex w-full flex-col items-center justify-center gap-10 p-4 md:flex-row">
        {/* Profile image: two layers that swap on hover */}
        <div className="relative h-[300px] w-[300px] shrink-0">
          <div className="hero-img hero-img-bg">
            <Image
              src="/images/Profile-IMAGE-red-background-1.webp"
              alt={`${name} portrait`}
              fill
              priority
              unoptimized
              sizes="300px"
              className="object-cover object-center"
            />
          </div>
          <div className="hero-img hero-img-nobg" aria-hidden="true">
            <Image
              src="/images/Profile-IMAGE-no-background-1.webp"
              alt=""
              fill
              unoptimized
              sizes="300px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Personal info */}
        <div className="hero-info flex flex-col gap-3">
          <div>
            <p className="hero-greeting">{heroGreeting}</p>
            <h1 className="hero-name text-3xl font-semibold">{name.toUpperCase()}</h1>
            <p className="hero-title">{title}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="hero-btn">
              DOWNLOAD CV
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--fg) text-(--bg) transition-opacity hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                </svg>
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--fg) text-(--bg) transition-opacity hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Big banner text (appears on hover) */}
        <div className="hero-banner whitespace-pre-line" aria-hidden="true">
          {title.split(" ").join("\n")}
        </div>
      </div>
    </section>
  );
}