import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#faf9f7] px-6 pt-24 text-[#292929] md:px-12 md:pt-32">
      {/* Text content */}
      <section className="relative z-10 mx-auto w-full max-w-5xl">
        <p className="mb-5 text-sm font-semibold tracking-[0.2em] text-[#777]">
          ERROR 404
        </p>

        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Looks like you&apos;ve drifted
          <br className="hidden sm:block" /> off the fairway.
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-[#777] md:text-xl">
          The page you&apos;re looking for isn&apos;t here,
          or it may have moved. Even the best explorers
          lose their way sometimes.
        </p>

        <p className="mt-2 max-w-3xl text-base leading-7 text-[#777] md:text-xl">
          Luckily, this little lighthouse knows the way home.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[#292929] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            Back to home
          </Link>

          <Link
            href="/#projects"
            className="rounded-xl bg-[#f1efeb] px-5 py-3 text-sm font-medium transition hover:bg-[#e7e4df]"
          >
            Explore projects
          </Link>

          <a
            href="https://github.com/HQ-Coding"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#f1efeb] px-5 py-3 text-sm font-medium transition hover:bg-[#e7e4df]"
          >
            Visit GitHub
          </a>
        </div>
      </section>

      {/* Lighthouse background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 bg-gray-100">
        <Image
          src="/images/lighthouse-404-original-size.webp"
          alt=""
          aria-hidden="true"
          width={1090}
          height={395}
          sizes="100vw"
          className="ml-auto block h-auto w-full object-contain object-bottom sm:w-[90%] lg:w-full"
        />
      </div>
    </main>
  );
}
