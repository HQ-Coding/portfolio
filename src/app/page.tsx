import { Suspense } from "react";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Experience from "@/components/experience/Experience";
import Certificates from "@/components/certificates/Certificates";
import Projects from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import { getProfile, getCertificates, getProjects } from "@/lib/data";

async function HomeContent() {
  const [profile, certificates, projects] = await Promise.all([
    getProfile(),
    getCertificates(),
    getProjects(),
  ]);

  return (
    <>
      <Hero
        name={profile.fullName}
        title={profile.heroTitle}
        cvUrl={profile.cvUrl}
        githubUrl={profile.social.github}
        linkedinUrl={profile.social.linkedin}
        heroGreeting={profile.heroGreeting}
      />
      <About profile={profile} />
      <Experience profile={profile} />
      <Certificates certificates={certificates} />
      <Projects projects={projects} />
      <Contact
        email={profile.email}
        githubUrl={profile.social.github}
        linkedinUrl={profile.social.linkedin}
      />
    </>
  );
}

function HomeFallback() {
  return (
    <div
      className="flex min-h-[70vh] items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="animate-pulse text-sm tracking-[0.3em] text-foreground/50 uppercase">
        Loading
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HomeFallback />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}