"use client";
import Link from "next/link";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

// 1️⃣ Color map (flat version — no borders)
const colorClasses = {
  blue: "bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300",
  gray: "bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300",
  red: "bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300",
  green:
    "bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300",
  yellow:
    "bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300",
  indigo:
    "bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300",
  purple:
    "bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300",
} as const;

type ColorKey = keyof typeof colorClasses;

// 2️⃣ Skills (grouped + mapped)
const skills: { label: string; color: ColorKey }[] = [
  // Languages
  { label: "C#", color: "indigo" },
  { label: "TypeScript", color: "yellow" },
  { label: "Python", color: "blue" },
  { label: "SQL", color: "gray" },
  // { label: "Bash", color: "green" },

  // Frameworks / Libraries
  { label: "React", color: "blue" },
  { label: "Node.js", color: "green" },
  { label: "Entity Framework", color: "purple" },
  { label: "DevExpress", color: "pink" },

  // Databases
  { label: "MySQL", color: "blue" },
  { label: "SQL Server", color: "indigo" },
  { label: "Oracle", color: "red" },
  { label: "PostgreSQL", color: "green" },

  // Cloud / Infra / Tools
  { label: "AWS", color: "yellow" },
  { label: "Docker", color: "blue" },
  { label: "IBM DataStage", color: "red" },
  { label: "AutoSys", color: "gray" },
];

export default function AboutMe() {
  return (
    <div>
      <section className="flex flex-col lg:flex-row items-start w-full px-6 py-20 bg-base-100 text-base-content">
        {/* Left Section */}
        <div className="flex flex-col items-center w-full lg:w-1/3 mb-10 lg:mb-0">
          <img
            src="https://media.licdn.com/dms/image/v2/D5603AQFTcjzQlRsStA/profile-displayphoto-shrink_800_800/B56ZUGxKZLGoAc-/0/1739575306354?e=1762992000&v=beta&t=2jxXU4xXTkbH2fL_pyVj_TO4Lyp1_Hlg8PfrESPKMeI"
            alt="Dev Punjabi"
            className="w-64 h-64 rounded-full object-cover shadow-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">Dev Punjabi</h1>
          <p className="text-lg font-medium text-base-content/70">
            Full Stack Software Developer
          </p>
          <p className="text-lg font-medium text-base-content/70">
            Periscope Capital
          </p>
          <div className="mt-6 w-full text-center">
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            <ul className="flex flex-wrap justify-center gap-2">
              {skills.map(({ label, color }) => (
                <li key={label}>
                  <span className={colorClasses[color]}>{label}</span>
                </li>
              ))}
            </ul>
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
              href="/Dev_Punjabi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn btn-sm btn-ghost text-primary text-lg">
                See My Resume!
              </button>
            </Link>
            </RoughNotation>
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        {/* Right Section*/}
        <div className="w-full lg:w-2/3 bg-base-100 rounded-xl p-6 space-y-6">
          <p className="text-lg leading-relaxed text-base-content/90">
            I’m a fourth-year Computer Science student at the University of
            Toronto with 1.5 years of professional development experience at
            Scotiabank and Periscope Capital.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            At Periscope Capital, I work as a Full Stack Software Developer
            building internal systems that support high-volume financial
            operations. My focus is on developing automation tools, data
            pipelines, and front-end modules that improve reliability and
            efficiency across trading workflows.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            Before that, I interned at Scotiabank, where I built internal tools
            to automate the internal promotion process using Bash, KornShell,
            and DataStage.
          </p>
          <p className="text-lg leading-relaxed text-base-content/90">
            Beyond work, I love exploring the outdoors. In the photos below I’m
            at the Whistler-Blackcomb Peak-to-Peak, Garibaldi Lake, Yosemite and
            Tin Hat Mountain hikes. Hiking reminds me of what I enjoy about
            development, solving problems step by step, navigating challenges,
            and reaching something rewarding at the end.
          </p>

          <div className="carousel w-full">
            <div id="item1" className="carousel-item w-full">
              <img
                src="https://github.com/punjdev/portfolio/assets/90057112/c48b5aa8-f781-411a-a4bd-09d0f2224a8a"
                className="w-full"
              />
            </div>
            <div id="item2" className="carousel-item w-full">
              <img src="/images/garibaldi.jpeg" className="w-full" />
            </div>
            <div id="item3" className="carousel-item w-full">
              <img src="/images/yosemite.jpeg" className="w-full" />
            </div>
            <div id="item4" className="carousel-item w-full">
              <img src="/images/tin-hat.jpeg" className="w-full" />
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
