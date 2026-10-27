"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ComponentType, type RefObject } from "react";
import type { Profile } from "@/lib/types";
import { EducationIcon, ExperienceIcon } from "../../../public/icons/icons";
import "./about.css";

/**
 * About section, rebuilt from the original site (index.html + style.scss + script.js).
 * Styles are in ./about.css (plain CSS, class and id names taken from the old site).
 * Animations:
 *  - Experience / Education cards fade + slide up when the section scrolls into view
 *  - The cat peeks over the Experience card on hover
 *  - "About me" text is typed out letter by letter
 *  - A reading cat with a speech bubble slides in from the right edge
 *
 * NOTE: never put the `hidden` attribute on these elements. Tailwind's reset adds
 * `[hidden] { display: none !important }`, which overrides the CSS in about.css.
 */

const IMAGES = {
  about: "/images/aboutme-white.webp",
  catLooking: "/images/cat-looking-1.webp",
  catReading: "/images/cat-reading.webp",
} as const;

const TYPING_SPEED_MS = 50; // one letter every 50 ms (same as the old site)
const CAT_SHOW_AT = 0.3; // reading cat slides in when 30% of the section has been seen

type AboutProps = {
  profile: Pick<Profile, "aboutText" | "experienceSummary" | "education">;
};

// Class is added while the section is visible and removed when it leaves,
// so the animation replays on every visit.
function useIsIntersecting(ref: RefObject<Element | null>, threshold: number) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setIsIntersecting(entry.isIntersecting);
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isIntersecting;
}

// For the reading cat: true while enough of the element is on screen.
// "Enough" = `share` of the element's height, but never more than `share` of the
// screen height (on phones this section is taller than the screen).
const THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100);

function useVisibleEnough(ref: RefObject<Element | null>, share: number) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const screenHeight = entry.rootBounds?.height ?? window.innerHeight;
          const needed = Math.min(entry.boundingClientRect.height, screenHeight) * share;
          setVisible(entry.isIntersecting && entry.intersectionRect.height >= needed);
        }
      },
      { threshold: THRESHOLDS },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, share]);

  return visible;
}

// Typing effect: starts once, when half of the paragraph is visible.
function useTyping(text: string) {
  const ref = useRef<HTMLParagraphElement>(null);
  const characters = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setCount(characters.length);
          return;
        }

        let typed = 0;
        timer = setInterval(() => {
          typed += 1;
          setCount(typed);
          if (typed >= characters.length) clearInterval(timer);
        }, TYPING_SPEED_MS);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [characters]);

  const shown = Math.min(count, characters.length);
  return {
    ref,
    typed: characters.slice(0, shown).join(""),
    rest: characters.slice(shown).join(""),
  };
}

type InfoCardProps = {
  id: string;
  title: string;
  Icon: ComponentType<{ className?: string }>;
  items: string[];
  visible: boolean;
  listId: string;
  withCat?: boolean;
};

function InfoCard({ id, title, Icon, items, visible, listId, withCat = false }: InfoCardProps) {
  return (
    <article id={id} className={visible ? "is-shown" : undefined}>
      {withCat && (
        <Image
          src={IMAGES.catLooking}
          alt=""
          width={50}
          height={50}
          aria-hidden="true"
          className="catHover"
        />
      )}

      <div className="about-icon">
        <Icon />
      </div>

      <h3 className="about-card-title">{title}</h3>

      <div id={listId}>
        {items.map((item) => (
          <p key={item} className="pLightGray">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

export default function About({ profile }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsVisible = useIsIntersecting(sectionRef, 0.3); // old class: .show
  const catVisible = useVisibleEnough(sectionRef, CAT_SHOW_AT); // old class: .fixed
  const { ref: textRef, typed, rest } = useTyping(profile.aboutText);

  // Format: "<duration> <title>", for example "1+ years Frontend Developer".
  const experience = profile.experienceSummary.map((item) =>
    [item.duration, item.title].filter(Boolean).join(" "),
  );
  const education = profile.education.map((item) => item.degree);

  return (
    <section id="about" ref={sectionRef} aria-labelledby="about-heading">
      {/* 1/3 Image */}
      <Image
        id="aboutmeIMG"
        src={IMAGES.about}
        alt="Portrait of Hadi Qasemian"
        width={420}
        height={420}
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {/* 2/3 Content */}
      <div className="about-content">
        <div id="aboutMeINFO">
          <InfoCard
            id="experianceINFO"
            listId="experience-list"
            title="Experience"
            Icon={ExperienceIcon}
            items={experience}
            visible={cardsVisible}
            withCat
          />
          <InfoCard
            id="educationINFO"
            listId="education-list"
            title="Education"
            Icon={EducationIcon}
            items={education}
            visible={cardsVisible}
          />
        </div>

        <div>
          <h2 id="about-heading" className="about-heading">
            ABOUT ME
          </h2>
          {/* The full text is always in the HTML (SEO + screen readers). Letters that are
              not typed yet are only invisible, so the paragraph never changes height. */}
          <p ref={textRef} className="aboutMeText">
            <span>{typed}</span>
            <span className="untyped">{rest}</span>
          </p>
        </div>
      </div>

      {/* Fixed-when-scrolling reading cat */}
      <div className={catVisible ? "catBox is-active" : "catBox"} aria-hidden="true">
        <Image
          src={IMAGES.catReading}
          alt=""
          width={100}
          height={100}
          sizes="100px"
          className="catReading"
        />
        <div className="catTextBox">hmmm ... Interesting!</div>
      </div>
    </section>
  );
}