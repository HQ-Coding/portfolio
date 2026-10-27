"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";

/**
 * Projects section.
 * Receives the already-validated projects from the server (see app/page.tsx)
 * and handles "Load More" on the client.
 *
 * Place this file at: components/projects/Projects.tsx
 */

const PAGE_SIZE = 3;

/* ---------------- Inline icons (no extra dependency) ---------------- */

function ArrowUpRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
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

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function ChevronIcon({ className = "", up = false }: { className?: string; up?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

/* ---------------- Card ---------------- */

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl
        border border-foreground/10 bg-background
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        transition-all duration-500 ease-out
        starting:translate-y-6 starting:opacity-0
        hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]"
    >
      {/* Image */}
      <div className="relative m-0.5 overflow-hidden rounded-t-[14px] bg-foreground/5">
        <div className="aspect-[1.48/1] overflow-hidden">
          {/* Plain <img> so any image host works without next.config changes.
              Swap for next/image once your hosts are in `images.remotePatterns`. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.name} project preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform
              duration-700 ease-out group-hover:scale-[1.045]"
          />
        </div>

        {/* Counter */}
        <span
          className="absolute left-4 top-4 rounded-full border border-white/30
            bg-white/85 px-3 py-1.5 text-xs font-medium tracking-wide
            text-neutral-700 backdrop-blur-md"
        >
          {pad(index + 1)} / {pad(total)}
        </span>

        {/* Badge (e.g. "1st 🥇") */}
        {project.badge && (
          <span
            className="absolute bottom-3 left-4 rounded-full bg-black/70 px-3
              py-1 text-[11px] font-semibold tracking-wide text-white
              backdrop-blur-md"
          >
            {project.badge}
          </span>
        )}

        {/* Open demo */}
        {project.webLink && (
          <a
            href={project.webLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name} demo`}
            className="absolute right-4 top-4 flex h-10 w-10 items-center
              justify-center rounded-full bg-white/90 text-neutral-900
              shadow-sm backdrop-blur-md transition-all duration-300
              hover:rotate-45 hover:bg-neutral-900 hover:text-white"
          >
            <ArrowUpRightIcon className="h-5 w-5" />
          </a>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7">
        <h3
          className="text-xl font-semibold tracking-tight text-foreground
            transition-colors duration-200 group-hover:text-foreground/70"
        >
          {project.name}
        </h3>

        {project.description && (
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            {project.description}
          </p>
        )}

        {project.note && (
          <p
            className="mt-3 inline-flex w-fit items-center gap-2 rounded-md
              bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium
              text-amber-700 dark:text-amber-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {project.note}
          </p>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-foreground/10
                  bg-foreground/[0.04] px-2.5 py-1.5 text-[11px]
                  font-medium text-foreground/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Links — pinned to the bottom so every card lines up */}
        <div className="mt-auto pt-6">
          <div className="border-t border-foreground/10 pt-5">
            <div className="flex flex-wrap items-center gap-3">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2
                    rounded-full border border-foreground/20 px-4 py-2.5
                    text-xs font-medium text-foreground transition-all
                    hover:border-foreground hover:bg-foreground
                    hover:text-background"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
              )}

              {project.webLink && (
                <a
                  href={project.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fold-btn gap-2 !rounded-full !px-4 !py-2.5 text-xs"
                >
                  Live Demo
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Section ---------------- */

export default function Projects({ projects }: { projects: Project[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const total = projects.length;
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < total;
  const canCollapse = !hasMore && total > PAGE_SIZE;

  const showMore = () =>
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, total));

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
    // keep the user at the top of the section after collapsing
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="projects"
      className="relative scroll-mt-20 overflow-hidden px-5 py-20 sm:px-8
        sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1380px]">
        {/* Heading */}
        <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-foreground/25" />
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.3em]
                text-foreground/60 sm:text-xs"
            >
              My Recent Works
            </p>
            <span className="h-px w-8 bg-foreground/25" />
          </div>

          <h2
            className="text-5xl font-semibold tracking-[-0.055em]
              text-foreground sm:text-6xl lg:text-7xl"
          >
            Projects<span className="text-[var(--accent)]">.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-foreground/60 sm:text-base">
            A collection of projects where I turn ideas into thoughtful,
            interactive digital experiences.
          </p>
        </header>

        {/* Grid */}
        {total === 0 ? (
          <p className="text-center text-sm text-foreground/50">
            No projects to show yet.
          </p>
        ) : (
          <div
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2
              lg:grid-cols-3 lg:gap-7"
            aria-live="polite"
          >
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                total={total}
              />
            ))}
          </div>
        )}

        {/* Load more / show less */}
        {hasMore && (
          <div className="mt-14 flex items-center justify-center gap-6 sm:mt-16">
            <span className="hidden h-px w-24 bg-foreground/15 sm:block" />
            <button
              type="button"
              onClick={showMore}
              className="glass-btn min-w-52 px-8 py-3.5 text-sm"
            >
              Load More
              <ChevronIcon />
            </button>
            <span className="hidden h-px w-24 bg-foreground/15 sm:block" />
          </div>
        )}

        {canCollapse && (
          <div className="mt-14 flex flex-col items-center gap-4 sm:mt-16">
            <p className="text-xs text-foreground/40">
              You&apos;ve reached the end.
            </p>
            <button
              type="button"
              onClick={showLess}
              className="glass-btn min-w-52 px-8 py-3.5 text-sm"
            >
              Show Less
              <ChevronIcon up />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
