"use client";
import Image from "next/image";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

// Skills, grouped so the list reads as areas of work rather than a keyword wall.
const skillGroups: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C#", "Java", "SQL", "Bash"],
  },
  {
    group: "Frameworks",
    items: [
      "React",
      "Next.js",
      "Node.js",
      ".NET",
      "Entity Framework",
      "FastAPI",
    ],
  },
  {
    group: "Data",
    items: [
      "PostgreSQL",
      "MySQL",
      "Microsoft SQL Server",
      "Cassandra",
      "Qdrant",
      "Pandas",
      "NumPy",
    ],
  },
  {
    group: "ML & AI",
    items: ["PyTorch", "Cohere", "Matplotlib"],
  },
  {
    group: "Infrastructure & Tools",
    items: [
      "AWS",
      "Docker",
      "Vercel",
      "Git",
      "Bitbucket Pipelines",
      "Bloomberg API",
      "IBM DataStage",
      "Jira",
    ],
  },
];

export default function AboutMe() {
  return (
    <div className="h-full">
      <section className="flex min-h-full w-full flex-col items-start bg-base-100 px-6 pb-10 pt-4 text-base-content lg:flex-row lg:pb-12 lg:pt-6">
        {/* Left Section */}
        <div className="flex flex-col items-center w-full lg:w-1/3 mb-10 lg:mb-0">
          <Image
            src="/per-15-anv.jpeg"
            alt="Portrait of Dev Punjabi"
            width={256}
            height={256}
            className="w-64 h-64 rounded-full object-cover shadow-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">Dev Punjabi</h1>
          <p className="text-lg font-medium text-base-content/70">
            Tech Consultant
          </p>
          <p className="text-lg font-medium text-base-content/70">
            Netlight
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="mailto:dev@devpunjabi.com"
              className="btn btn-sm btn-outline btn-circle"
              aria-label="Email"
              title="Email"
            >
              <FaEnvelope className="text-base" />
            </a>
            <a
              href="https://www.linkedin.com/in/devpunjabi/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline btn-circle"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedin className="text-base" />
            </a>
            <a
              href="https://github.com/punjdev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline btn-circle"
              aria-label="GitHub"
              title="GitHub"
            >
              <FaGithub className="text-base" />
            </a>
          </div>
          <div className="mt-8 w-full">
            <h3 className="mb-4 text-center text-xl font-semibold">Skills</h3>
            <div className="space-y-4">
              {skillGroups.map(({ group, items }) => (
                <div key={group}>
                  <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    {group}
                  </p>
                  <ul className="flex flex-wrap justify-center gap-1.5">
                    {items.map((label) => (
                      <li key={label}>
                        <span className="badge badge-sm badge-outline border-base-content/25 text-base-content/80">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <RoughNotation
              show
              type="box"
              color="#d20108ff"
              animationDelay={300}
              animationDuration={1200}
              strokeWidth={2}
            >
              <Link
                href="/Dev_Punjabi_Resume_v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ghost text-primary text-lg"
              >
                See My Resume!
              </Link>
            </RoughNotation>
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        {/* Right Section*/}
        <div className="w-full lg:w-2/3 bg-base-100 rounded-xl p-6 space-y-6">
          <p className="text-lg leading-relaxed text-base-content/90">
            I am a Computer Science graduate from the University of Toronto
            with 2+ years of professional development experience at Scotiabank
            and Periscope Capital.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            I am currently a Tech Consultant at Netlight, where I work with
            clients to design and build software that solves real business
            problems, bringing my full-stack background to teams across
            different industries.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            Before Netlight, I spent over two years at Periscope Capital as a
            Full Stack Software Developer, building internal systems that
            support high-volume financial operations. My focus was on
            developing automation tools, data pipelines, and front-end modules
            that improve reliability and efficiency across trading workflows.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            Before that, I interned at Scotiabank, where I built internal tools
            to automate deployment workflows across development, QA, and production
            environments using Bash, KornShell, and DataStage.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            Beyond work, I love exploring the outdoors. In the photos below I am
            at the Whistler-Blackcomb Peak-to-Peak, Garibaldi Lake, Yosemite and
            Tin Hat Mountain hikes. Hiking reminds me of what I enjoy about
            development, solving problems step by step, navigating challenges,
            and reaching something rewarding at the end.
          </p>

          <div className="carousel w-full">
            <div id="item1" className="carousel-item w-full">
              <Image
                src="https://github.com/punjdev/portfolio/assets/90057112/c48b5aa8-f781-411a-a4bd-09d0f2224a8a"
                alt="View from Whistler-Blackcomb Peak-to-Peak"
                width={1600}
                height={900}
                unoptimized
                className="w-full"
              />
            </div>
            <div id="item2" className="carousel-item w-full">
              <Image
                src="/images/garibaldi.jpeg"
                alt="Hiking at Garibaldi Lake"
                width={1600}
                height={900}
                className="w-full"
              />
            </div>
            <div id="item3" className="carousel-item w-full">
              <Image
                src="/images/yosemite.jpeg"
                alt="Trail view in Yosemite"
                width={1600}
                height={900}
                className="w-full"
              />
            </div>
            <div id="item4" className="carousel-item w-full">
              <Image
                src="/images/tin-hat.jpeg"
                alt="Tin Hat Mountain landscape"
                width={1600}
                height={900}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex w-full justify-center gap-2 py-2">
            <a href="#item1" className="btn btn-xs">
              1
            </a>
            <a href="#item2" className="btn btn-xs">
              2
            </a>
            <a href="#item3" className="btn btn-xs">
              3
            </a>
            <a href="#item4" className="btn btn-xs">
              4
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
