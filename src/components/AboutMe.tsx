"use client";
import Link from "next/link";
// import garibaldi from "@/public/images/garibaldi.jpeg";
import tinHat from "@/public/images/tin-hat.jpeg";
import yosemite from "@/public/images/yosemite.jpeg";


export default function AboutMe() {
  return (
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
          Software Developer
        </p>
        <p className="text-lg font-medium text-base-content/70">
          Periscope Capital
        </p>
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
          Before that, I interned at Scotiabank, where I built internal tools to
          automate the internal promotion process using Bash, KornShell, and
          DataStage.
        </p>
        <p className="text-lg leading-relaxed text-base-content/90">
          Beyond work, I love exploring the outdoors. In the photos below I’m at
          the Whistler-Blackcomb Peak-to-Peak, Garibaldi Lake, Yosemite and Tin
          Hat Mountain hikes. Hiking reminds me of what I enjoy about
          development, solving problems step by step, navigating challenges, and
          reaching something rewarding at the end.
        </p>

        <div className="carousel w-full">
          <div id="item1" className="carousel-item w-full">
            <img
              src="https://github.com/punjdev/portfolio/assets/90057112/c48b5aa8-f781-411a-a4bd-09d0f2224a8a" 
              className="w-full"
            />
          </div>
          <div id="item2" className="carousel-item w-full">
            <img
              src="/images/garibaldi.jpeg"
              className="w-full"
            />
          </div>
          <div id="item3" className="carousel-item w-full">
            <img
              src="/images/yosemite.jpeg"
              className="w-full"
            />
          </div>
          <div id="item4" className="carousel-item w-full">
            <img
              src="/images/tin-hat.jpeg"
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
  );
}
