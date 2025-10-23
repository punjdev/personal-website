"use client";
import Link from "next/link";
// import { navLinks } from "@/lib/constants/links";
import { RoughNotation } from "react-rough-notation";
import { useMemo } from "react";

export default function Hero() {
  const [aboutColor, contactColor] = useMemo(() => ["#93c5fd", "#f9a8d4"], []);

  return (
    <section className="px-6 pt-24 pb-16 text-center text-base-content lg:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold lg:text-6xl">
          Hi, I’m <span className="text-primary">Dev Punjabi</span> :)
        </h1>

        <p className="mt-4 text-lg lg:text-2xl text-base-content/80 leading-relaxed">
          I’m a{" "}
          <span className="text-secondary font-medium">
            Software Developer at Periscope Capital
          </span>{" "}
          and a{" "}
          <span className="text-secondary font-medium">
            Computer Science specialist
          </span>{" "}
          studying at the University of Toronto. Learn more{" "}
          <Link
            href="/about"
            className="ml-1 mr-1 font-normal text-black transition-colors"
          >
            <RoughNotation
              show
              type="highlight"
              color={aboutColor}
              animationDelay={300}
              animationDuration={1500}
            >
              about me
            </RoughNotation>
          </Link>
          or{" "}
          <Link
            href="/contact"
            className="ml-1 font-normal text-black transition-colors"
          >
            <RoughNotation
              show
              type="highlight"
              color={contactColor}
              animationDelay={300}
              animationDuration={1500}
            >
              get in touch
            </RoughNotation>
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
