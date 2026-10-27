import type { Profile } from "@/lib/types";
import { Reveal, SkillBar } from "./motion";
import "./experience.css";

type ExperienceProps = {
  profile: Pick<Profile, "experienceSummary" | "skills" | "softSkills">;
  /** The old site always showed "80%" on the bars. Set to false to show only the level. */
  showPercent?: boolean;
};

export default function Experience({ profile, showPercent = true }: ExperienceProps) {
  const { experienceSummary, skills, softSkills } = profile;

  return (
    <section
      id="experience"
      className="exp-section container mx-auto mb-20 flex max-w-7xl scroll-mt-24 flex-col items-center px-5"
    >
      <h2 className="m-10 text-3xl font-bold">Experience</h2>

      {/* Roles + duration */}
      {/* <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {experienceSummary.map((role) => (
          <li key={role.order}>
            <Reveal className="exp-box h-full p-8">
              {role.duration ? (
                <>
                  <p className="text-xl font-extrabold md:text-2xl" style={{ color: "var(--accent)" }}>
                    {role.duration}
                  </p>
                  <p className="exp-muted sm:text-lg">{role.title}</p>
                </>
              ) : (
                <p className="font-bold sm:text-lg md:text-xl">{role.title}</p>
              )}
            </Reveal>
          </li>
        ))}
      </ul> */}

      {/* Soft skills checklist */}
      <Reveal className="exp-box my-10 w-full py-10 pl-5">
        <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4">
          {softSkills.map((skill) => (
            <li key={skill} className="my-2 flex items-center gap-1">
              <svg
                className="w-5 shrink-0 sm:w-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM404.4 276.7L324.4 404.7C320.2 411.4 313 415.6 305.1 416C297.2 416.4 289.6 412.8 284.9 406.4L236.9 342.4C228.9 331.8 231.1 316.8 241.7 308.8C252.3 300.8 267.3 303 275.3 313.6L302.3 349.6L363.7 251.3C370.7 240.1 385.5 236.6 396.8 243.7C408.1 250.8 411.5 265.5 404.4 276.8z" />
              </svg>
              <span className="text-sm sm:text-lg md:text-xl">{skill}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Skill bars */}
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
        {skills.map((skill) => (
          <SkillBar
            key={skill.order}
            name={skill.name}
            level={skill.level}
            percent={skill.percent}
            showPercent={showPercent}
          />
        ))}
      </div>
    </section>
  );
}
